/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
var bcrypt = require('bcrypt');
var Promise = require('bluebird');
module.exports = {

  attributes: {
    email: {
      type: 'string',
      isEmail: true,
      required: true,
      unique: true
    },
    password: {
      type: 'string',
      minLength: 6,
      required: true,
      columnName: 'encryptedPassword'
    }
  },
  customToJSON: function() {
    return _.omit(this, ['password']);
  },
  beforeCreate: function (values, cb) {
    bcrypt.hash(values.password, 10, (err, hash) => {
      if (err) {
        return cb(err);
      }
      values.password = hash;
      cb();
    });
  },
  comparePassword: function (password, user) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, match) => {
        if (err) {
          reject(err);
        }

        if (match) {
          resolve(true);
        } else {
          reject(err);
        }
      });
    });
  }

};

