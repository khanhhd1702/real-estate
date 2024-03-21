const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.get("/", userController.getUserByEmail);
router.get("/info", userController.getUserInfo);

router.post("/signup", userController.signUp);
router.post("/login", userController.logIn);
router.post("/info", userController.updateUserInfo);

router.delete("/delete", userController.deleteUser);

module.exports = router;
