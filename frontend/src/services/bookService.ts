import type { Book } from "../types/Book";
import apiClient from "./apiClient";

// Get all books
export const getAllBooks = async (): Promise<Book[]> => {
  const response = await apiClient.get("/book");
  return response.data;
};

// Delete book by ISBN
export const deleteBook = async (isbn: string): Promise<void> => {
  const response = await apiClient.delete(`/book/${isbn}`);
  return response.data;
};

// Add a new book (omit auto-managed fields)
export const addBook = async (
  bookData: Omit<Book, "createdAt" | "updatedAt">
): Promise<Book> => {
  const response = await apiClient.post("/book", bookData);
  return response.data;
};

// Update book by ISBN
export const updateBook = async (
  isbn: string,
  bookData: Omit<Book, "createdAt" | "updatedAt">
): Promise<Book> => {
  const response = await apiClient.put(`/book/${isbn}`, bookData);
  return response.data;
};
