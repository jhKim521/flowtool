import { Router } from "express";

import {
  getCaptureDetail,
  getCaptureList,
} from "../controllers/capture-query.controller";

export const captureQueryRouter = Router();

captureQueryRouter.get("/api/captures", getCaptureList);
captureQueryRouter.get("/api/captures/:id", getCaptureDetail);
