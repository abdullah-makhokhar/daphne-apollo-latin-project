import express, { type Request, type Response, type ErrorRequestHandler } from "express";
import cors from "cors";

const app = express();

// Validate required environment variables
const requiredEnvVars = ["NODE_ENV"];
const missingEnvVars = requiredEnvVars.filter(
  (envVar) => !process.env[envVar]
);

if (missingEnvVars.length > 0) {
  console.warn(
    `Warning: Missing environment variables: ${missingEnvVars.join(", ")}`
  );
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `${req.method} ${req.path} ${res.statusCode} ${duration}ms`
    );
  });
  next();
});

// Health check endpoint - for load balancers
app.get("/api/healthz", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "production",
  });
});

// Root endpoint
app.get("/", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    message: "Daphne's Root API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Not found",
    path: req.path,
    method: req.method,
  });
});

// Global error handler
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error("Error:", err);

  const statusCode = (err as any).statusCode || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : (err as any).message;

  res.status(statusCode).json({
    error: message,
    statusCode,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV !== "production" && {
      stack: (err as any).stack,
    }),
  });
};

app.use(errorHandler);

// Export as Vercel serverless function
export default app;
