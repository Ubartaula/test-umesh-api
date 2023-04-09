const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

router
  .route("/")
  .get(userController.getUsers)
  .post(userController.addUser)
  .put(userController.editUser)
  .delete(userController.deleteUser);

module.exports = router;
