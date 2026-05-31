const router = require("express").Router();

const {
  registerController,
  loginController,
  logoutController,
  refreshAccessTokenController,
  updateProfileController,
} = require("../controllers/auth.controller");

const { authMiddleware } = require("../middlewares/auth.middleware");
const { ApiResponse } = require("../utils/ApiResponse");

// signup (supports both /signup and /register)
router.post("/signup", registerController);
router.post("/register", registerController);

// login
router.post("/login", loginController);

// logout
router.post("/logout", logoutController);

// refresh token (supports both /refresh-token and /refresh)
router.post("/refresh-token", refreshAccessTokenController);
router.post("/refresh", refreshAccessTokenController);

// me endpoint to fetch current user profile
router.get("/me", authMiddleware, (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.user, "User profile fetched successfully"));
});

// profile endpoint to update user profile
router.patch("/profile", authMiddleware, updateProfileController);

module.exports = router;