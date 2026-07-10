import { Router } from "express";

import {
  getCaptureLogDetail,
  getCaptureLogList,
} from "../controllers/capture-log.controller";

export const captureLogRouter = Router();

captureLogRouter.get("/capture-logs", getCaptureLogList);
captureLogRouter.get("/capture-logs/:id", getCaptureLogDetail);
