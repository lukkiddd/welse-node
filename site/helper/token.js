import jwt from 'jsonwebtoken';
import config from '../config';

class tokenManage {
  static generate(value) {
    var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    var newVal = _extends({}, value);
    newVal.token = undefined;
    return jwt.sign(newVal, config.SECRET_KEY, {
      expiresIn: '360d',
    });
  }

  static async verify(token) {
    try {
      return await jwt.verify(token, config.SECRET_KEY);
    } catch (err) {
      return err;
    }

  }
}

export { tokenManage };