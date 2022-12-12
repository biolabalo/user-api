const express = require("express");

const router = express.Router();

const User = require("../controllers/user");

const user = new User();

router.get("/" ,user.getAllUsers);

router.get("/:id", user.getUser);


router.post("/", user.createUser);

router.put("/:id", user.updateUser);

router.delete("/:id", user.deleteUser);

module.exports = router;
