export const LOG_MESSAGES = {
  // Database logs
  DB: {
    CONNECTING: "Attempting to connect to MongoDB...",
    CONNECTED: (host: string) => `MongoDB Connected: ${host}`,
    DISCONNECTED: "MongoDB disconnected. Attempting to reconnect...",
    ERROR_INITIAL: (err: unknown) => `MongoDB initial connection error: ${String(err)}`,
    ERROR_RUNTIME: (err: unknown) => `MongoDB runtime error: ${String(err)}`,
    CLOSED_GRACEFUL: (signal: string) => `MongoDB connection closed via ${signal}`,
    URI_MISSING: "MONGO_URI is not defined in environment variables.",
  },

  // Server logs
  SERVER: {
    STARTED: (port: number | string) => `Server running at http://localhost:${port}`,
    STOPPING: "Shutting down server...",
  },

  // Auth & User logs
  AUTH: {
    USER_REGISTERED: (email: string) => `User registered successfully: ${email}`,
    LOGIN_FAILED: (email: string) => `Failed login attempt for: ${email}`,
    UNAUTHORIZED_ACCESS: (userId: string, path: string) =>
      `Unauthorized access attempt by user ${userId} on ${path}`,
  },

  // Post logs
  POST: {
    CREATED: (postId: string, authorId: string) =>
      `Post ${postId} created by user ${authorId}`,
    ACCESS_DENIED: (postId: string, userId: string) =>
      `Access denied to post ${postId} for user ${userId}`,
  },
} as const;

export type LogMessages = typeof LOG_MESSAGES;