import { Router } from "express";
import { authenticateToken } from "../middleware/authenticateToken";
import { createBook, deleteBook, getAllBooks, getBookById, updateBook } from "../controllers/book.controller";

const bookRouter = Router()

bookRouter.use(authenticateToken)
bookRouter.get("/", getAllBooks)
bookRouter.get("/:id", getBookById)
bookRouter.post("/",createBook)
bookRouter.put("/:id",updateBook)
bookRouter.delete("/:id",deleteBook)



export default bookRouter