import ForbiddenError from '../exceptions/ForbiddenError.js';
import TokenManager from '../utils/tokenManager.js';
import UnauthorizedError from '../exceptions/UnauthorizedError.js';

const authHandler = {
  authenticationHandler: (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader) {
        throw new UnauthorizedError('Tidak terautentikasi');
      }
      const token = authHeader.split(' ')[1];
      const payload = TokenManager.verifyAccessToken(token);
      req.user = payload;
      next();
    } catch (error) {
      next(error);
    }
  },

  authorizationHandler:
    (...requiredRole) =>
    (req, res, next) => {
      const { role } = req.user;

      if (!requiredRole.includes(role)) {
        throw new ForbiddenError('Akses ditolak');
      }

      next();
    },
};

export default authHandler;
