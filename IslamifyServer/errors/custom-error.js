class CustomAPIError extends Error {
  constructor(message, statuscode) {
    super(message);
    this.statusCode = statuscode;
  }
}

const createCustomError = (message, status) => {
  return new CustomAPIError(message, status);
};

export { createCustomError, CustomAPIError };
