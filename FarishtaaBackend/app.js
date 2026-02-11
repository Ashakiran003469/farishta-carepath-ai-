require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const errorController = require("./controllers/errorController");
const patientRouter = require("./routers/patientRouter");
const authRouter = require("./routers/authRouter");
const doctorRouter = require("./routers/doctorRouter");
const { isLoggedIn, isPatient } = require("./middleware/auth");

const app = express();

/* -------------------- MIDDLEWARE -------------------- */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
  console.log("Request Received:", req.method, req.url);
  next();
});

/* -------------------- ROUTES -------------------- */
app.use("/api/auth", authRouter);
app.use("/api/patient", isLoggedIn, isPatient, patientRouter);
app.use("/api/doctor", doctorRouter);

/* -------------------- ERROR HANDLER -------------------- */
app.use(errorController.getError);

/* -------------------- SERVER + DB -------------------- */
const PORT = process.env.PORT || 3001;

// ✅ MongoDB connection using ENV
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
  });
