import { Router, type IRouter } from "express";
import healthRouter from "./health";
import propertiesRouter from "./properties";
import inquiriesRouter from "./inquiries";
import visitsRouter from "./visits";
import dealsRouter from "./deals";
import analyticsRouter from "./analytics";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/properties", propertiesRouter);
router.use("/inquiries", inquiriesRouter);
router.use("/visits", visitsRouter);
router.use("/deals", dealsRouter);
router.use("/analytics", analyticsRouter);

export default router;
