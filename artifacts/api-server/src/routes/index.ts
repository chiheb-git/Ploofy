import { Router, type IRouter } from "express";
import healthRouter from "./health";
import categoriesRouter from "./categories";
import dishesRouter from "./dishes";
import qrRouter from "./qr";
import statsRouter from "./stats";
import uploadRouter from "./upload";

const router: IRouter = Router();

router.use(healthRouter);
router.use(categoriesRouter);
router.use(dishesRouter);
router.use(qrRouter);
router.use(statsRouter);
router.use(uploadRouter);

export default router;
