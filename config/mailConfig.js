const emailConfig = {};

emailConfig.host = 'smtp.gmail.com';
emailConfig.port = 587; // secure SMTP;
emailConfig.secure_connection = false; // false for TLS - as a boolean not string
emailConfig.request_auth = true; // false for TLS - as a boolean not string

emailConfig.feedbackMail = ['kasun@speralabs.com'];
emailConfig.notificationMail = ['kasun@speralabs.com', 'sahan@speralabs.com'];
emailConfig.email = 'test.speralabs@gmail.com';

emailConfig.password = 'speralabs123';
emailConfig.domains = ['gmail.com', 'googlemail.com'];
emailConfig.invoiceAttachmentPath = '';

// email
emailConfig.sendgrid_api_key =
  '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';

module.exports = emailConfig;
