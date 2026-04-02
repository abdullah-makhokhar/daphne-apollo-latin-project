import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import * as pinoHttpModule from "pino-http";
import { logger } from "../artifacts/api-server/src/lib/logger";
import router from "../artifacts/api-server/src/routes";

const pinoHttp = (pinoHttpModule as any).default || pinoHttpModule;

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req: Request) {
        return {
          id: (req as any).id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res: Response) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount API routes
app.use("/api", router);

// Root health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "API is running" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Export as Vercel serverless function
export default app;
