const router = require("express").Router();

const {
  requestAccessController,
  verifyMagicLinkController,
} = require("../controllers/access.controller");

// request access email
router.post("/request", requestAccessController);

// verify the magic link
router.get("/verify/:token", verifyMagicLinkController);

module.exports = router;