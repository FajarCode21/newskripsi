import jwt from 'jsonwebtoken';
import UnauthorizedError from '../exceptions/UnauthorizedError.js';

const tokenManager = {
  generateAccessToken: (payload) => {
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, {
      expiresIn: '15m',
    });
    return accessToken;
  },

  generateRefreshToken: (payload) => {
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_KEY, {
      expiresIn: '7d',
    });
    return refreshToken;
  },

  verifyRefreshToken: (refreshToken) => {
    try {
      const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
      return payload;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedError('Token sudah kadaluarsa');
      }
      throw new UnauthorizedError('RefreshToken tidak valid');
    }
  },

  verifyAccessToken: (accessToken) => {
    try {
      const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY);
      return payload;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedError('Token sudah kadaluarsa');
      }
      throw new UnauthorizedError('AccessToken tidak valid');
    }
  },
};

export default tokenManager;
