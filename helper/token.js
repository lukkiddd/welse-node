import jwt from 'jsonwebtoken';
import config from '../config';

class tokenManage {
  static generate(value) {
    const newVal = { ...value };
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