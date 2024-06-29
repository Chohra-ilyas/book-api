const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JTW_SECRET_KEY);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: "invalid token" });
    }
  } else {
    res.status(401).json({ message: "no token provided" });
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({
        message: "you are not allowed ,you only can update your profile!!",
      });
      //status 403 forbidden
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({
        message: "you are not allowed ,only Admin allowed!!",
      });
      //status 403 forbidden
    }
  });
};

module.exports = {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};
