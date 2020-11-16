import jwt from "jsonwebtoken";

export default (request, response, next) => {
  try {
    request.tokenData = jwt.verify(request.headers.authorization.split(" ")[1], "some-secret-key");
    next();
  } catch (error) {
    return response.status(401).send({ message: "AUTH FAILED", error: error });
  }
};
