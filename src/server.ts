import { app } from "./app";
import { connectDB } from "./config/db";
import type { Server } from "http";

let server: Server | null = null;

export const startServer = async (): Promise<Server> => {
  await connectDB();

  const PORT = process.env.PORT || 3000;
  server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  // Optional: handle graceful shutdown signals
  process.on("SIGINT", async () => {
    console.log("SIGINT received, shutting down...");
    await stopServer();
    process.exit(0);
  });

  return server;
};

export const stopServer = async (): Promise<void> => {
  if (server) {
    await new Promise<void>((resolve) => server!.close(() => resolve()));
    server = null;
  }
};
