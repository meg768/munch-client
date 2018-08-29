WEB_LOCATION = www/munch
WEB_USER     = admin
WEB_SERVER   = nestor

upload:
	npm run build
	scp -r build/* $(WEB_USER)@$(WEB_SERVER):$(WEB_LOCATION)
