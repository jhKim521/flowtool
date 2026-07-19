import { Router } from "express";

import { proxyRequest } from "../controllers/proxy.controller";

export const proxyRouter = Router();

proxyRouter.all("/proxy", proxyRequest);
