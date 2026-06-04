class ClientError extends Error {
  constructor(message, statusCode = 400, status = 'fail') {
    super(message);
    this.statusCode = statusCode;
    this.status = status;
    this.name = 'ClientError';
  }
}

export default ClientError;
