import { Router } from "express";

export const testRouter = Router();

testRouter.post("/api/test/echo", (req, res) => {
  res.status(201).json({
    received: req.body ?? null,
    query: req.query,
  });
});

testRouter.get("/api/test/error", (_req, res) => {
  res.status(500).json({
    message: "Test error response",
  });
});
