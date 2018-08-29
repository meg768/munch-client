WEB_LOCATION = www/munch
WEB_USER     = admin
WEB_SERVER   = nestor

build:
	 npm run build

upload:
	scp -r build/* $(WEB_USER)@$(WEB_SERVER):$(WEB_LOCATION)
