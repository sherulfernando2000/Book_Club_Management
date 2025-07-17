import { Router } from "express";
import readerRouter from "./reader.routes";
import authRouter from "./auth.route";

const rootRouter = Router();

rootRouter.use("/reader", readerRouter)
rootRouter.use("/auth", authRouter)


export default rootRouter