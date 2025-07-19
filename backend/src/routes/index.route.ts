import { Router } from "express";
import readerRouter from "./reader.routes";
import authRouter from "./auth.route";
import bookRouter from "./book.routes";
import lendingRouter from "./lending.route";
import overdueRouter from "./overdue.route";

const rootRouter = Router();

rootRouter.use("/reader", readerRouter)
rootRouter.use("/book", bookRouter)
rootRouter.use("/lendings", lendingRouter)
rootRouter.use("/overdue", overdueRouter)
rootRouter.use("/overdue", lendingRouter)

rootRouter.use("/auth", authRouter)


export default rootRouter