'use strict';

module.exports = {
  forgot_password_email: function(user, req, token, mailOptions) {
    mailOptions.html = [
      'Hi ' + user.name + ',',
      'We have received a request to reset the password for your account.',
      'If you made this request, please click on the link below or paste this into your browser to complete the process:',
      'http://' + req.headers.host + '/#!/reset/' + token,
      'This link will work for 1 hour or until your password is reset.',
      'If you did not ask to change your password, please ignore this email and your account will remain unchanged.'
    ].join('\n\n');
    mailOptions.subject = 'Resetting the password';
    return mailOptions;
  },

  new_user_email: function(user, req, token, mailOptions) {
    mailOptions.html = [
      'Hi ' + user.name + ',',
      'Welcome to Crack\'n App! You will now never have to worry about getting a project done ever again.',
      'If you are hyped as fuq about using our app, please click on the link below or paste this into your browser to complete the process:',
      'http://' + req.headers.host + '/#!/new-user/' + token,
      'This link will work for 1 hour or until you follow the link.',
      'If you did not ask to use our app and thereby have your life changed forever, please ignore this email.'
    ].join('\n\n');
    mailOptions.subject = 'Joining Crack\'n';
    return mailOptions;
  }
};