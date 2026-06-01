const isUrlExpired = (url) => {
  // 1. Expiration Date Check
  if (url.expiresAt && new Date() > new Date(url.expiresAt)) {
    return { expired: true, reason: "This secure link has expired." };
  }

  // 2. Click Limit Check
  if (typeof url.maxClicks === "number" && url.clicks >= url.maxClicks) {
    return { expired: true, reason: "This secure link has reached its maximum click limit." };
  }

  // 3. Self-Destruct Check (If clicked 1 or more times)
  if (url.selfDestruct && url.clicks >= 1) {
    return { expired: true, reason: "This secure link was set to self-destruct after the first access and has already been viewed." };
  }

  return { expired: false };
};

module.exports = { isUrlExpired };