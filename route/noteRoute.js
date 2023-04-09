const express = require("express");
const router = express.Router();
const noteController = require("../controller/noteController");

// const verifyJWT = require("../middleware/verifyJWT");
// router.use(verifyJWT);

router
  .route("/")
  .get(noteController.getNotes)
  .post(noteController.addNote)
  .put(noteController.editNote)
  .delete(noteController.deleteNote);

module.exports = router;
