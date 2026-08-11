import CustomError from "./CustomError.js";

class EntityNotFoundError extends CustomError<ErrorCode> {}

export default EntityNotFoundError;
