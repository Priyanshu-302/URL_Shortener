const router = require("express").Router();

const { redirectToOriginalController } = require("../controllers/redirect.controller");

// public / protected access
router.get("/:shortCode", redirectToOriginalController);

module.exports = router;