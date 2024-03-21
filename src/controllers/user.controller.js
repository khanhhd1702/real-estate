const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;

module.exports = {
  signUp: async (req, res) => {
    try {
      const { email, password, name, phone, birthday } = req.body;

      const isPasswordValid = password.match(/^.{6,100}$/);
      if (!isPasswordValid) {
        return res.status(400).jsend("e", "Password must be between 6 and 100 characters");
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User({
        email: email,
        password: hashedPassword,
        name: name,
        phone: phone,
        birthday: birthday,
      });
      await user.save();

      const created = { email, name, phone, birthday };

      return res.status(201).jsend("", "User created", created);
    } catch (err) {
      if (err.code === 11000) {
        return res.status(409).jsend("e", "User already exists");
      }
      return res.status(400).jsend("e", "Error when creating user", err);
    }
  },
  logIn: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).jsend("e", "User is not exist");
      }
      if (user.banned) {
        return res.status(403).jsend("e", "User is banned");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).jsend("e", "Wrong password");
      }

      const token = jwt.sign({ userId: user._id, email: user.email }, secretKey, { expiresIn: "7d" });

      return res.status(200).jsend("", "Loged in", { Authorization: `Bearer ${token}` });
    } catch (err) {
      return res.status(400).jsend("e", "Error when trying to log in", err);
    }
  },
  getUserByEmail: async (req, res) => {
    const user = await User.findOne({ email: req.query.email });

    if (user) {
      return res.status(200).jsend("", "Loged in", ({ email, name, phoneNumber, admin, address, avatar, banned } = user));
    } else {
      return res.status(404).jsend("e", "User not found");
    }
  },
  getUserInfo: async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, secretKey);
      if (!decodedToken || !decodedToken.userId) {
        return res.status(401).jsend("e", "Invalid token");
      }
      const user = await User.findById(decodedToken.userId);
      if (!user) {
        return res.status(404).jsend("e", "User not found");
      }
      const { email, name, phone, address, avatar, birthday } = user;
      return res.status(200).jsend("", "", { email, name, phone, address, avatar, birthday });
    } catch (err) {
      return res.status(500).jsend("e", "Something went wrong", err.message);
    }
  },
  updateUserInfo: async (req, res) => {
    try {
      const { name, phone, address, avatar, birthday } = req.body;

      if (req.body.email) {
        return res.status(403).jsend("e", "Can not update email");
      }
      if (req.body.password) {
        return res.status(403).jsend("e", "Can not update password via this method");
      }
      if (req.body.admin) {
        return res.status(403).send("e", "Cannot change admin permissions");
      }

      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, secretKey);
      if (!decodedToken || !decodedToken.userId) {
        return res.status(401).jsend("e", "Invalid token");
      }

      const user = await User.findById(decodedToken.userId);
      if (!user) {
        return res.status(404).jsend("e", "User not found");
      }

      const updated = await User.findOneAndUpdate(
        { _id: decodedToken.userId },
        {
          $set: {
            name: name || user.name,
            address: address || user.address,
            avatar: avatar || user.avatar,
            phone: {
              country: phone.country || user.phone.country,
              number: phone.number || user.phone.number,
            },
            birthday: birthday || user.birthday,
          },
        },
        { new: true }
      );

      if (!updated) {
        return res.status(404).jsend("e", "User not found");
      }
      const updatedUser = {
        name: updated.name,
        address: updated.address,
        avatar: updated.avatar,
        phone: updated.phone,
        birthday: updated.birthday,
      };
      return res.status(200).jsend("", "User informations updated", { user: updatedUser });
    } catch (err) {
      return res.status(500).jsend("e", "Internal Server Error", err);
    }
  },
  deleteUser: async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];

      const decodedToken = jwt.verify(token, secretKey);
      if (!decodedToken || !decodedToken.userId) {
        return res.status(404).jsend("e", "Invalid token");
      }

      await User.findByIdAndDelete(decodedToken.userId).catch((err) => {
        return res.status(400).jsend("e", "Could not delete user");
      });

      return res.status(200).jsend("e", "User deleted");
    } catch (err) {
      return res.status(500).jsend("e", "Internal Server Error");
    }
  },
};
