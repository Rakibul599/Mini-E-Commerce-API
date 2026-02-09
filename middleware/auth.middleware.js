const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

const newUservalidators = [
  check("name")
    .isLength({ min: 1 })
    .withMessage("Name is required")
    .matches(/^[a-zA-Z .-]+$/)
    .withMessage("Name must only contain letters, spaces, periods, or hyphens")
    .trim(),

  check("email")
    .isEmail()
    .withMessage("Invalid email address")
    .trim()
    .custom(async (value) => {
    const user = await User.findOne({ email: value });
      if (user) {
        throw new Error("Email already in use");
      }
    }),

  check("password")
    .isStrongPassword()
    .withMessage(
      "Password must be at least 8 characters long & should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol"
    ),
];

const newUserValidationHandler = function (req, res, next) {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    // response the errors
    // console.log(mappedErrors);
    res.status(200).json({
      errors: mappedErrors,
    });
  }
};



const auth = (req, res, next) => {
    try {
        const { authorization } = req.headers;

        if (!authorization || !authorization.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }

        // Bearer TOKEN
        const token = authorization.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded; 
        // console.log(decoded);
        next();
    } catch (error) {
        return res.status(401).json({ message: "Authentication failed" });
    }
};

module.exports = { newUservalidators, newUserValidationHandler,auth };