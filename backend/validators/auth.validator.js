const validateRegister = (req, res, next) => {
  const { username, email, password, role } = req.body;
  const errors = [];
  const allowedRoles = ["user", "admin", "moderator"];

  if (!username || username.trim().length < 3) {
    errors.push(
      "Username is required and should be at least 3 characters long",
    );
  }
  if (
    !email ||
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
  ) {
    errors.push("Valid email is required");
  }
  if (!password || password.length < 6) {
    errors.push(
      "Password is required and should be at least 6 characters long",
    );
  }
  if (role && !allowedRoles.includes(role)) {
    errors.push("Role must be one of: user, admin, moderator");
  }
  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (
    !email ||
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
  ) {
    errors.push("Valid email is required");
  }
  if (!password || password.length < 6) {
    errors.push(
      "Password is required and should be at least 6 characters long",
    );
  }
  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }
  next();
};

export { validateRegister, validateLogin };
