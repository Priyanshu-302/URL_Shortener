const router = require("express").Router();
const { authMiddleware } = require("../middlewares/auth.middleware");
const {
  getMyBioProfileController,
  updateBioProfileController,
  getPublicBioProfileController,
} = require("../controllers/bio.controller");

// Visitor route (anonymous)
router.get("/public/:username", getPublicBioProfileController);

// Authenticated editor routes
router.use(authMiddleware);
router.get("/my-profile", getMyBioProfileController);
router.put("/update", updateBioProfileController);

module.exports = router;