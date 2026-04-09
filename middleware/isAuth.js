const jwt = require('jsonwebtoken');

const isAuthenticated = async (req, res, next) => {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith('Bearer')
    ) {
      return res.status(401).json({ message: 'No token' });
    }
    const token = req.headers.authorization.split(' ')[1];

    const payload = jwt.verify(token, process.env.TOKEN_SECRET);

    req.payload = payload;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: 'No token found' });
  }
};

module.exports = { isAuthenticated };
