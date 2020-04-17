var _ = require('lodash');
module.exports = {
  create: function (req, res) {
    if (req.body.password !== req.body.confirmPassword) {
      return ResponseService.json(401, res, 'Password doesn\'t match');
    }

    var allowedParameters = [
      'email', 'password'
    ];

    var data = _.pick(req.body, allowedParameters);
    console.log(data);

    User.create(data).meta({fetch: true}).then((user) => {
      var responseData = {
        user: user,
        token: JwtService.issue({ id: user.id })
      };
      return ResponseService.json(200, res, 'User created successfully', responseData);
    }).catch((error) => {
      if (error.invalidAttributes) {
        return ResponseService.json(400, res, 'User could not be created', error.Errors);
      }
    });
  }
};
