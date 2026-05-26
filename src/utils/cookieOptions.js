const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "development",
  sameSite: "strict",
};

module.exports = { cookieOptions };
