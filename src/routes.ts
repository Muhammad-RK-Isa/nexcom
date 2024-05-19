/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to '/'
 * @type {string[]}
 */
export const authRoutes = [
  "/signin",
  "/signup",
  "/error",
  "/reset-password",
  "/create-new-password",
  "/verify-email",
];

export const protectedRoutes = ["/profile", "/checkout"];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";
export const adminPrefix = "/admin";

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/";
