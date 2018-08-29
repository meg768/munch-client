
var querystring  = require('querystring');
var Path         = require('path');
var URL          = require('url');

var sprintf     = require('yow/sprintf');
var extend      = require('yow/extend');

var isArray     = require('yow/is').isArray;
var isString    = require('yow/is').isString;
var isObject    = require('yow/is').isObject;
var isFunction  = require('yow/is').isFunction;

var debug = function() {};

class Gopher {

	constructor() {

		var options = {protocol:'https:'};

		if (isObject(arguments[0])) {
			extend(options, arguments[0]);
		}

		else if (isString(arguments[0])) {
			var url = new URL.parse(arguments[0]);


			if (url.protocol != undefined)
				options.protocol = url.protocol;

			if (url.port != undefined)
				options.port = url.port;

			if (url.hostname != undefined)
				options.hostname = url.hostname;

			if (isObject(arguments[1]))
				extend(options, arguments[1]);

		}

		if (options.debug) {
            debug = isFunction(options.debug) ? options.debug : console.log;
        }

		this.defaultOptions = extend({}, options);

	};

	get() {
		return this.request.apply(this, ['GET', ...arguments]);
	}

	put() {
		return this.request.apply(this, ['PUT', ...arguments]);
	}

	post() {
		return this.request.apply(this, ['POST', ...arguments]);
	}

	delete() {
		return this.request.apply(this, ['DELETE', ...arguments]);
	}


	request() {

		var self    = this;
		var https   = require('https');
		var http    = require('http');
		var options = {};

		if (isString(arguments[0])) {
			if (isString(arguments[1])) {
				options.method = arguments[0];
				options.path   = arguments[1];

				extend(options, arguments[2]);
			}
			else {
				options.method = arguments[0];
				extend(options, arguments[1]);
			}
		}
		else if (isObject(arguments[0])) {
			options = arguments[0];
		}
		else {
			return Promise.reject('Missing options.');
		}

	    return new Promise(function(resolve, reject) {
			var data = isObject(options.body) ? JSON.stringify(options.body) : options.body;
			var headers = {};

			if (self.defaultOptions.headers != undefined) {
				for (var key in self.defaultOptions.headers) {
					headers[key.toLowerCase()] = self.defaultOptions.headers[key];
				}

			}

			if (options.headers != undefined) {
				for (var key in options.headers) {
					headers[key.toLowerCase()] = options.headers[key];
				}

			}

			headers['content-length'] = data == undefined ? 0 : data.length;

			var params = {};
			extend(params, self.defaultOptions, options, {headers:headers});

			if (isString(params.path) && isObject(params.params)) {
				var parts = [];

				params.path.split('/').forEach(function(part) {
					var match = part.match('^:([_$@A-Za-z0-9]+)$');

					if (!match)
						match = part.match('^{([_$@A-Za-z0-9]+)}$');

					if (match) {
						var name = match[1];

						if (params.params[name] != undefined) {
							parts.push(params.params[name]);
						}
						else
							parts.push(part);
					}
					else
						parts.push(part);

				});

				params.path = parts.join('/');
			}

			if (isObject(params.query)) {
				params.query = querystring.stringify(params.query);
			}

			if (isString(params.query) && params.query.length > 0) {
				params.path = Path.join(params.path, '?' + params.query);
			}


			var iface = params.protocol === "https:" ? https : http;

			debug('Request:', params);

	        var request = iface.request(params, function(response) {
	            var body = [];

				response.on('data', function(chunk) {
					body.push(chunk);
				});

	            response.on('end', function() {
	                body = body.join('');

					var contentType = '';

					if (response.headers && isString(response.headers['content-type'])) {
						contentType = response.headers['content-type'];
					}

					if (contentType.match("application/json")) {
						try {
							body = JSON.parse(body);
		                }
						catch (error) {
		                    console.error('Cannot parse JSON from API.', body);
							body = {};
		                }
					}

	                var reply = {
	                    statusCode     : response.statusCode,
	                    statusMessage  : response.statusMessage,
	                    headers        : response.headers,
	                    body           : body
	                };

	                if (response.statusCode < 200 || response.statusCode > 299) {
	                    reject(new Error(reply.statusMessage));
	                }
					else {
	                    resolve(reply);
	                }
	            })
	        });

	        if (data) {
	            request.write(data);
	        }

			request.on('error', function(error) {
				reject(error);
			});

	        request.end();
	    })
	};
};

module.exports = Gopher;
