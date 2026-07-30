// Centralized error handler - keeps controllers clean (just throw or pass errors to next())
const errorHandler = (err, req, res, next) => {
  console.error("Error handler caught:", err);
  console.error(err?.stack || "No stack available");

  let statusCode = err.statusCode || 500;
  let message = err?.message || err || "Server Error";

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    statusCode = 404;
    message = "Resource not found";
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 400;
    message = `Duplicate value for field: ${Object.keys(err.keyValue)}`;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

const notFound = (req, res, next) => {
  res.status(404).json({ success: false, message: `Route not found - ${req.originalUrl}` });
};

module.exports = { errorHandler, notFound };
