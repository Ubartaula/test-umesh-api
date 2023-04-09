const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No bearer code at auth header" });
  }

  const accessToken = authHeader.split(" ")[1];

  jwt.verify(accessToken, process.env.Access_Token, (err, decoded) => {
    if (err)
      return res.status(403).json({ message: "Forbidden at verification" });

    req.username = decoded?.UserInfo?.username;
    req.role = decoded?.UserInfo?.role;
    next();
  });
};

module.exports = verifyJWT;
