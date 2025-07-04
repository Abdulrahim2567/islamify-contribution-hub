//package imports
import express from "express";
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

//file imports
import authRoutes from "./routes/auth.routes.js";
import contributionRoutes from "./routes/contribution.routes.js";
import membersRoutes from "./routes/member.routes.js";
import activityRoutes from "./routes/activity.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import notFound from "./middleware/notFound.js";
import customErrorHandler from "./middleware/errorHandler.js";
import connectDB from "./db/connect.js";

const app = express();

//make dotenv file available on server
configDotenv();

//set server PORT
const PORT = process.env.PORT || 7000;

//cors
app.use(
	cors({
		origin: process.env.CLIENT_URL, // ✅ Your React+Vite frontend URL
		credentials: true, // ✅ Required for sending cookies
	})
);


//json objects
app.use(express.json());

//cookie parser for reading cookies
app.use(cookieParser());

//for auth routes
app.use("/api/v1/auth", authRoutes);
//for message routes
app.use("/api/v1/contribution", contributionRoutes);
//for member routes
app.use("/api/v1/member", membersRoutes);
//for activities
app.use("/api/v1/activity", activityRoutes);
//for app settings
app.use("/api/v1/settings", settingsRoutes);


//for 404 routes
app.use(notFound);

//for error handling
app.use(customErrorHandler);

//server function
const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("connected to MongoDB...");
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}...`);
    });
  } catch (error) {
    console.log(error);
  }
};
//start server
startServer();
