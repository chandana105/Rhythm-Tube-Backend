const jwt = require('jsonwebtoken')
const mySecret = process.env['SECRET_KEY']


const authVerify = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(token, mySecret);
    req.user = { userId: decoded.userId }
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized access , Please add the token" })
  }
}

module.exports = { authVerify }