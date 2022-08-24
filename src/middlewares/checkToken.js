import jwt from "../utils/jwt.js";
import { ForbiddenError } from "../utils/errors.js";

const tokenCheck = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      return next(new ForbiddenError(403, "required token!"));
    }
    let { id } = jwt.verify(token);

    return next();

  } catch (error) {
    return next(new ForbiddenError(403, error.message))
  }
};
export default tokenCheck;
