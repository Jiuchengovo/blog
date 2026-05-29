const errorHandler = (err, req, res, _next) => {
  console.error(err.stack);

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message).join(", ");
    return res.status(400).json({ message: messages });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(", ");
    return res.status(409).json({ message: `Duplicate value for: ${field}` });
  }

  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
};

export default errorHandler;
