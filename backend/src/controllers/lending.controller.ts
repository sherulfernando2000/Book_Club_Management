// controllers/lending.controller.ts
import { Request, Response, NextFunction } from "express";
import { LendingModel } from "../models/lending";
import mongoose from "mongoose";
import { APIError } from "../errors/APIError";
import { BookModel } from '../models/Book';

//lend book
export const lendBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { book, reader } = req.body;

    // Find the book by ID
    const foundBook = await BookModel.findById(book);
    if (!foundBook) {
      return next(new APIError(404, "Book not found"));
    }

    // Check available copies
    if (foundBook.copies <= 0) {
      return next(new APIError(400, "No available copies to lend"));
    }

    // Decrease available copies
    foundBook.copies -= 1;
    await foundBook.save();

    // Lend for 14 days
    const lentDate = new Date();
    const dueDate = new Date(lentDate);
    dueDate.setDate(dueDate.getDate() + 14);

    const lending = new LendingModel({ book, reader, lentDate, dueDate });
    const savedLending = await lending.save();

    res.status(201).json(savedLending);
  } catch (err: any) {
    if (err instanceof mongoose.Error.ValidationError) {
      const errors = Object.values(err.errors).map((e) => e.message);
      return next(new APIError(400, "Validation failed", errors));
    }

    next(new APIError(500, "Error lending book", err.message));
  }
};

//return book
export const returnBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const lending = await LendingModel.findById(id);
    if (!lending) {
      return next(new APIError(404, "Lending record not found"));
    }

    if (lending.returned) {
      return next(new APIError(400, "Book has already been returned"));
    }

    // Mark lending as returned
    lending.returned = true;
    await lending.save();

    //  Increase availableCopies in Book
    const book = await BookModel.findById(lending.book);
    if (book) {
      book.copies += 1;
      await book.save();
    }

    res.status(200).json({ message: "Book returned successfully", lending });
  } catch (err: any) {
    next(new APIError(500, "Error returning book", err.message));
  }
};

//all active lending
export const getActiveLendings = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const active = await LendingModel.find({ returned: false }).populate("book reader");
    res.status(200).json(active);
  } catch (err: any) {
    next(new APIError(500, "Error fetching lendings", err.message));
  }
};


//lending history by book
export const getLendingHistoryByBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookId } = req.params;
    const history = await LendingModel.find({ book: bookId }).populate("reader");
    res.status(200).json(history);
  } catch (err: any) {
    next(new APIError(500, "Error fetching history", err.message));
  }
};

//lending history by reader
export const getLendingHistoryByReader = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { readerId } = req.params;
    const history = await LendingModel.find({ reader: readerId }).populate("book");
    res.status(200).json(history);
  } catch (err: any) {
    next(new APIError(500, "Error fetching history", err.message));
  }
};



