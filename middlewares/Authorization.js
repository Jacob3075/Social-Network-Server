import jwt from "jsonwebtoken";

export default (request, response, next) => {
  let token;
  try {
    token = jwt.verify(request.headers.authorization.split(" ")[1], "some-secret-key");
    request.tokenData = token;
    next();
  } catch (error) {
    console.log("TOKEN" + request.headers.authorization.split(" ")[1]);
    return response.status(401).send({ message: "AUTH FAILED", error: error });
  }
};
