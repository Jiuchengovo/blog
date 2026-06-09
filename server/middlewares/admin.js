import auth from "./auth.js";

const admin = (req, res, next) => {
  return auth(req, res, () => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  });
};

export default admin;
