// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const connectDB = require("./config/db");
// const { errorHandler, notFound } = require("./middlewares/errorHandler");

// // Routes
// const authRoutes = require("./routes/authRoutes");
// const userRoutes = require("./routes/userRoutes");
// const flatRoutes = require("./routes/flatRoutes");
// const complaintRoutes = require("./routes/complaintRoutes");
// const visitorRoutes = require("./routes/visitorRoutes");
// const maintenanceRoutes = require("./routes/maintenanceRoutes");
// const noticeRoutes = require("./routes/noticeRoutes");
// const aiRoutes = require("./routes/aiRoutes");
// const dashboardRoutes = require("./routes/dashboardRoutes");

// connectDB();

// const app = express();

// // Core middleware
// // app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// // CLIENT_URL supports a comma-separated list, e.g.:
// // CLIENT_URL=http://localhost:5173,https://your-app.vercel.app
// const allowedOrigins = (process.env.CLIENT_URL || "")
//   .split(",")
//   .map((url) => url.trim())
//   .filter(Boolean);

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       // Allow non-browser requests (no Origin header, e.g. curl/Postman/server-to-server)
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         console.warn(`CORS blocked request from unlisted origin: ${origin}`);
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );

// app.use(express.json());
// app.use(cookieParser());

// // Health check
// app.get("/api/health", (req, res) => res.json({ success: true, message: "API running" }));

// // Mounted routes
// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/flats", flatRoutes);
// app.use("/api/complaints", complaintRoutes);
// app.use("/api/visitors", visitorRoutes);
// app.use("/api/maintenance", maintenanceRoutes);
// app.use("/api/notices", noticeRoutes);
// app.use("/api/ai", aiRoutes);
// app.use("/api/dashboard", dashboardRoutes);

// // Error handling (must be last)
// app.use(notFound);
// app.use(errorHandler);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const { errorHandler, notFound } = require("./middlewares/errorHandler");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const flatRoutes = require("./routes/flatRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const visitorRoutes = require("./routes/visitorRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const aiRoutes = require("./routes/aiRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

connectDB();

const app = express();

// Core middleware
// CLIENT_URL supports a comma-separated list, e.g.:
// CLIENT_URL=http://localhost:5173,https://your-app.vercel.app
const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);

// Vercel generates several URL variants for the same project (production domain,
// git-branch URL, and a unique URL per preview deploy) - all of them follow the
// pattern below, so this catches any of them without needing CLIENT_URL updated
// every time a new preview URL is generated.
const VERCEL_PROJECT_PATTERN = /^https:\/\/society-management-system[a-z0-9-]*\.vercel\.app$/;

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (no Origin header, e.g. curl/Postman/server-to-server)
      if (!origin || allowedOrigins.includes(origin) || VERCEL_PROJECT_PATTERN.test(origin)) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked request from unlisted origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Friendly root route - so visiting the bare deployed URL doesn't just 404
app.get("/", (req, res) =>
  res.json({
    success: true,
    message: "Smart Society API is running. See /api/health for a status check.",
  })
);

// Health check
app.get("/api/health", (req, res) => res.json({ success: true, message: "API running" }));

// Mounted routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/flats", flatRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Error handling (must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));