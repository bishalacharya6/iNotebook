const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "Bishalgodboy$";

// Route 1 - Route for creating a user in the database or website
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Enter a valid Password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success = false;
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    try {
      // Check if user with the same email already exists
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(400).json({ success, error: "Email already exists" });
      }

      //decrypting the password
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // Create a new user using the User model/schema, we can also use a different way to do it
      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authtoken });
      // return res.json(user);
    } catch (error) {
      //catching the unexpected erro
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Route 2 - authenticate a user, Login credentials
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Must enter the password").exists(),
  ],
  async (req, res) => {
    let success = false;
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ success, error: "Invalid Credentials" });
      }

      const passcompare = await bcrypt.compare(password, user.password);
      if (!passcompare) {
        return res.status(400).json({ success, error: "Invalid Credentials" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };

      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ erro: "Internal Server Error Occured" });
    }
  }
);

// Route 3 - Getting the details of the users who are loggedin

router.post("/getuser", fetchuser, async (req, res) => {

  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ erro: "Internal Server Error Occured" });
  }

});

module.exports = router;
