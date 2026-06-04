import ClientError from './ClientError.js';

class ForbiddenError extends ClientError {
  constructor(message) {
    super(message, 403, 'fail');
    this.name = 'ForbiddenError';
  }
}

export default ForbiddenError;
