const router = require("express").Router();

const {
  createShortUrlController,
  getSingleUrlController,
  updateUrlController,
  deleteUrlController,
  getMyUrlsController,
  checkShortCodeController,
  verifyPasswordController,
} = require("../controllers/url.controller");

const { authMiddleware } = require("../middlewares/auth.middleware");

// Public route to check if shortCode exists and isProtected (no auth header needed)
router.get("/check/:shortCode", checkShortCodeController);
router.post("/verify-password", verifyPasswordController);

// All routes below require authorization
router.use(authMiddleware);

// Create the short url
router.post("/create", createShortUrlController);

// Get all urls for the authenticated user
router.get("/my-urls", getMyUrlsController);

// Get single url (legacy or detail check)
router.get("/:id", getSingleUrlController);

// Update url
router.patch("/:id", updateUrlController);

// Delete url
router.delete("/:id", deleteUrlController);

module.exports = router;