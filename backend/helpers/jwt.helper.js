import jwt from "jsonwebtoken";

function genToken(payload) {
  return jwt.sign(payload, process.env.SECRET_KEY, {
    algorithm: "HS256",
    expiresIn: "3h",
  });
}

function verifyToken(token) {
  try {
    const payload = jwt.verify(token, process.env.SECRET_KEY);
    return { error: null, payload };
  } catch (error) {
    return { error, payload: null };
  }
}

const jwtHelper = {
  genToken,
  verifyToken,
};

export default jwtHelper;