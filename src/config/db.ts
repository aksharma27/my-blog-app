import mongoose from "mongoose";
import {LOG_MESSAGES} from "../utils/constants.js";

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URL;

  if (!uri) {
    throw new Error(LOG_MESSAGES.DB.URI_MISSING);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(LOG_MESSAGES.DB.CONNECTED(conn.connection.host));
  } catch (error) {
    console.error(LOG_MESSAGES.DB.ERROR_INITIAL(error));
    process.exit(1);
  }

  mongoose.connection.on("error", (err) => {
    console.error(LOG_MESSAGES.DB.ERROR_RUNTIME(err));
  });

  mongoose.connection.on("disconnected", () => {
    console.warn(LOG_MESSAGES.DB.DISCONNECTED);
  });

  // Handle graceful shutdown
  const shutdown = async (signal: string) => {
    await mongoose.connection.close();
    console.log(LOG_MESSAGES.DB.CLOSED_GRACEFUL(signal));
    process.exit(0);
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
};