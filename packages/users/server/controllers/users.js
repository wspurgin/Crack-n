'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Project = mongoose.model('Project'),
  ObjectId = require('mongoose').Types.ObjectId,
  async = require('async'),
  config = require('meanio').loadConfig(),
  crypto = require('crypto'),
  nodemailer = require('nodemailer'),
  templates = require('../template');

/**
* Makes a random password string
*/
function randomizeString() {
    var randomized = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for(var i=0; i < 16; i+=1)
        randomized += possible.charAt(Math.floor(Math.random() * possible.length));

    return randomized;
}

/**
 * Auth callback
 */
exports.authCallback = function(req, res) {
  res.redirect('/');
};

/**
 * Show login form
 */
exports.signin = function(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.redirect('#!/login');
};

/**
 * Logout
 */
exports.signout = function(req, res) {
  req.logout();
  res.redirect('/');
};

/**
* Update
*/
exports.update = function(req, res) {
  var user = req.user;

  req.assert('name', 'You must enter a name').notEmpty();
  req.assert('email', 'You must enter a valid email address').isEmail();
  req.assert('username', 'Username cannot be more than 20 characters').len(1, 20);

  var errors = req.validationErrors();
  if (errors) {
    return res.status(400).send(errors);
  }

  if (req.body.name) user.name = req.body.name;
  if (req.body.username) user.username = req.body.username;
  if (req.body.email) user.email = req.body.email;
  user.save(function(err) {
    if (err) {
      switch (err.code) {
        case 11000:
        case 11001:
          res.status(400).send([{
            msg: 'Username already taken',
            param: 'username'
          }]);
          break;
        default:
          var modelErrors = [];

          if (err.errors) {

            for (var x in err.errors) {
              modelErrors.push({
                param: x,
                msg: err.errors[x].message,
                value: err.errors[x].value
              });
            }

            res.status(400).send(modelErrors);
          }
      }

      return res.status(400);
    }
    else {
      res.json(200, 'Successfully updated user', user);
    }
  });
};

/**
 * Session
 */
exports.session = function(req, res) {
  res.redirect('/');
};

/**
 * Create user
 */
exports.create = function(req, res, next) {
  var user = new User(req.body);

  user.provider = 'local';

  // because we set our user.provider to local our models/user.js validation will always be true
  req.assert('name', 'You must enter a name').notEmpty();
  req.assert('email', 'You must enter a valid email address').isEmail();
  req.assert('password', 'Password must be between 8-20 characters long').len(8, 20);
  req.assert('username', 'Username cannot be more than 20 characters').len(1, 20);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();
  if (errors) {
    return res.status(400).send(errors);
  }

  // Hard coded for now. Will address this with the user permissions system in v0.3.5
  user.roles = ['authenticated'];
  user.save(function(err) {
    if (err) {
      switch (err.code) {
        case 11000:
        case 11001:
          res.status(400).send([{
            msg: 'Username already taken',
            param: 'username'
          }]);
          break;
        default:
          var modelErrors = [];

          if (err.errors) {

            for (var x in err.errors) {
              modelErrors.push({
                param: x,
                msg: err.errors[x].message,
                value: err.errors[x].value
              });
            }

            res.status(400).send(modelErrors);
          }
      }

      return res.status(400);
    }
    req.logIn(user, function(err) {
      if (err) return next(err);
      return res.redirect('/');
    });
    //exports.createNewUser(req, res, next);
    res.status(200);
  });
};
/**
 * Send User
 */
exports.me = function(req, res) {
  res.json(req.user || null);
};

/**
 * Find user by id
 */
exports.user = function(req, res, next, id) {
  User
    .findOne({
      _id: id
    })
    .exec(function(err, user) {
      if (err) return next(err);
      if (!user) return next(new Error('Failed to load User ' + id));
      req.profile = user;
      next();
    });
};

/**
 * Resets the password
 */
exports.resetpassword = function(req, res, next) {
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  }, function(err, user) {
    if (err) {
      return res.status(400).json({
        msg: err
      });
    }
    if (!user) {
      return res.status(400).json({
        msg: 'Token invalid or expired'
      });
    }
    req.assert('password', 'Password must be between 8-20 characters long').len(8, 20);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
    var errors = req.validationErrors();
    if (errors) {
      return res.status(400).send(errors);
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.save(function(err) {
      req.logIn(user, function(err) {
        if (err) return next(err);
        return res.send({
          user: user,
        });
      });
    });
  });
};

/*
 * Change password
 */
exports.changepassword = function(req, res, next) {
  User.findOne({
          email: req.body.email
        }, function(err, user) {
          if (err) {
              return res.status(400).json({
              msg: err
            });
          }
          else if (!user) {
              return res.status(400).json({
              msg: 'User not found with that email'
            });
          }
          else if(!user.authenticate(req.body.password)) {
            return res.status(400).send([{
                    msg: 'Your password is incorrect',
                    param: 'password'
                  }]);
          } else {
            req.assert('newPassword', 'Password must be between 8-20 characters long').len(8, 20);
            req.assert('confirmNewPassword', 'Passwords do not match').equals(req.body.newPassword);
           
            var errors = req.validationErrors();
            if (errors) {
              return res.status(400).send(errors);
            }

            user.password = req.body.confirmNewPassword;
            user.save();
            return res.status(200).send();
          }
  });
};

/**
 * Send reset password email
 */
function sendMail(mailOptions) {
  var transport = nodemailer.createTransport(config.mailer);
  transport.sendMail(mailOptions, function(err, response) {
    if (err) return err;
    return response;
  });
}

/**
 * Callback for forgot password link
 */
exports.forgotpassword = function(req, res, next) {
  async.waterfall([

      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({
          $or: [{
            email: req.body.text
          }, {
            username: req.body.text
          }]
        }, function(err, user) {
          if (err || !user) return done(true);
          done(err, user, token);
        });
      },
      function(user, token, done) {
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        user.save(function(err) {
          done(err, token, user);
        });
      },
      function(token, user, done) {
        var mailOptions = {
          to: user.email,
          from: config.emailFrom
        };
        mailOptions = templates.forgot_password_email(user, req, token, mailOptions);
        sendMail(mailOptions);
        done(null, true);
      }
    ],
    function(err, status) {
      var response = {
        message: 'Mail successfully sent',
        status: 'success'
      };
      if (err) {
        response.message = 'User does not exist';
        response.status = 'danger';
      }
      res.json(response);
    }
  );
};

/**
 * Callback for creating new user link
 */
exports.createNewUser = function(req, res, next) {
  async.waterfall([

      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({
            email: req.body.email
        }, function(err, user) {
          if (err || !user) return done(true);
          done(err, user, token);
        });
      },
      function(user, token, done) {
        user.newUserToken = token;
        user.newUserTokenExpires = Date.now() + 3600000; // 1 hour
        user.save(function(err) {
          done(err, token, user);
        });
      },
      function(token, user, done) {
        var mailOptions = {
          to: user.email,
          from: config.emailFrom
        };
        mailOptions = templates.new_user_email(user, req, token, mailOptions);
        sendMail(mailOptions);
        done(null, true);
      }
    ],
    function(err, status) {
      var response = {
        message: 'Mail successfully sent',
        status: 'success'
      };
      if (err) {
        response.message = 'User does not exist';
        response.status = 'danger';
      }
      res.json(response);
    }
  );
};

/**
 * Method after following new user link
 */
exports.newUser = function(req, res, next) {
  User.findOne({
    newUserToken: req.params.token,
    newUserTokenExpires: {
      $gt: Date.now()
    }
  }, function(err, user) {
    if (err) {
      return res.status(400).json({
        msg: err
      });
    }
    if (!user) {
      return res.status(400).json({
        msg: 'Token invalid or expired'
      });
    }
    var errors = req.validationErrors();
    if (errors) {
      return res.status(400).send(errors);
    }
    user.active = true;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.save(function(err) {
      req.logIn(user, function(err) {
        if (err) return next(err);
        return res.send({
          user: user,
        });
      });
    });
  });
};

/*
* Search for a user using a substring (takes a substring and a callback)
*/
exports.searchUsers = function(substring, cb) {
  var exp = new RegExp('^' + substring, 'i');
  async.waterfall([
    // Make query
    function(callback) {
      User
        .find()
        .or([
          {username: {$regex: exp}},
          {email: {$regex: exp}}
        ])
        .lean()
        .select({ _id: 1, username: 1, email: 1, name: 1 })
        .sort('_id')
        .limit(100)
        .exec(function(err, query) {
          if (err) callback(err, query);
          callback(null, query);
        });
      },
    // Remove duplicates (O(n), figured it was fine)
    function(users, callback) {
      if (!!users.length) {
        var cur = users[0]._id.toString();
        var cleanedQuery = [];
        cleanedQuery.push(users[0]);
        for (var i = 1; i < users.length; i+=1) {
          if (cur !== users[i]._id.toString()) {
            cur = users[i]._id.toString();
            cleanedQuery.push(users[i]);
          }
        }
        callback(null, cleanedQuery);
      } else {
        callback('No users found', []);
      }
    }
    // Send results to callback function 
  ], function(err, results) {
    if (err) console.log(err);
    cb(results);
  });
};


/**
* delete account of user passed in id
*/
exports.deleteAccount = function(req, res, id) {
  var expiration = new Date();
  expiration.setMonth(expiration.getMonth() + 1);
  var randomized = randomizeString();
  
  async.waterfall([
    // Flag the user for removal
    function(callback) {
      User
      .findOne({_id: new ObjectId(id)},
      function(err, user) {
        if (err || !user) 
          callback('Unsuccessful attempt to flag user for removal');
        user.flagForRemoval(expiration);
        user.set('password', randomized);
        user.save();
        callback(null);
      });
    },
    // Flag each of user's projects for removal
    function(callback) {
      var projectCount;
      Project
        .find({owner: new ObjectId(id)},
        function(err, arr) {
          projectCount = arr.length;
        })
        .forEach( function(err, project) {
          if (err || !project)
            callback('Unsuccessful attempt to flag projects for removal');
          project.flagForRemoval(expiration);
          project.save();
          projectCount-=1;
          if (projectCount===0)
            callback(null);
        });
    }
    // Handle errors if either function goes wrong
  ], function (err) {
    if (err) res.status(400).send(err);
    console.log('User account flagged for deletion successfully');
    res.redirect('/');
  });
};
