import express, { Request, Response } from "express";
import routes from "./routes";
import cookieParser from "cookie-parser";

export const app = express();

app.use(cookieParser());
app.use(express.json());

app.use(routes);
// Define all routes here
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

// Optional: error handling middleware
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});
