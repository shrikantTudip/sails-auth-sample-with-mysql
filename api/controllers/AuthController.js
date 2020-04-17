module.exports = {
  login: function (req, res) {
    var email = req.param('email');
    var password = req.param('password');

    verifyParams(res, email, password);

    User.findOne({ email: email }).then((user) => {
      if (!user) {
        return invalidEmailOrPassword(res);
      }
      signInUser(req, res, password, user);
    }).catch(() => {
      return invalidEmailOrPassword(res);
    });
  }
};


function signInUser(req, res, password, user) {
  User.comparePassword(password, user).then(
    function (valid) {
      if (!valid) {
        return this.invalidEmailOrPassword();
      } else {
        var responseData = {
          token: generateToken(user.id)
        };
        return ResponseService.json(200, res, 'Successfully signed in', responseData);
      }
    }
  ).catch(() => {
    return ResponseService.json(403, res, 'Forbidden');
  });
}


function invalidEmailOrPassword(res) {
  return ResponseService.json(401, res, 'Invalid email or password');
}

function verifyParams(res, email, password) {
  if (!email || !password) {
    return ResponseService.json(401, res, 'Email and password required');
  }
}


function generateToken(userId) {
  return JwtService.issue({ id: userId });
}
