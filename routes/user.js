const express = require("express");

const router = express.Router();

const User = require("../controllers/user");

const user = new User();

router.get("/:id", user.getUser);

router.get("/", user.getAllUsers);

router.post("/", user.checkAuth, user.createUser);

router.patch("/:id", user.checkAuth, user.updateUser);

router.delete("/:id", user.checkAuth, user.deleteUser);

module.exports = router;
