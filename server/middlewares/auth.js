import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const token = header.split(" ")[1];

  try {
    const secret = process.env.JWT_SECRET || "fallback-secret";
    const decoded = jwt.verify(token, secret);
    req.user = { id: decoded.userId, role: decoded.role || "user" };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

/** Like auth, but doesn't fail when no token — just leaves req.user undefined */
export const softAuth = (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return next();
  }

  const token = header.split(" ")[1];

  try {
    const secret = process.env.JWT_SECRET || "fallback-secret";
    const decoded = jwt.verify(token, secret);
    req.user = { id: decoded.userId, role: decoded.role || "user" };
  } catch {
    // token invalid — treat as unauthenticated
  }

  next();
};

export default auth;
