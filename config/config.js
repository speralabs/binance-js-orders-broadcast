const config = {};

config.web_port = process.env.HTTP_PORT;
config.https_web_port = process.env.HTTPS_PORT;

// DB
config.database = process.env.DATABASE_URL;
config.testDatabase = process.env.TEST_DATABASE_URL;
config.responseAPI = process.env.RESPONSE_END;
config.app_name = process.env.APP_NAME;
config.server_path = process.env.SERVER_PATH;
config.sslPrivetKeyPath = process.env.PRIVATE_KEY_PATH;
config.sslCertKeyPath = process.env.CERT_KEY_PATH;
config.sslCertAuthPath = process.env.CERT_AUTH_PATH;
config.baseUrl = process.env.BASE_URL;

module.exports = config;
