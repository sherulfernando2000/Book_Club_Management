import React from "react";
import type { Book } from "../../types/Book";

interface BookTableProps {
  books: Book[];
  search: string;
  onView: (isbn: string) => void;
  onDelete: (isbn: string) => void;
}

const BookTable: React.FC<BookTableProps> = ({
  books,
  search,
  onView,
  onDelete,
}) => {
  return (
    <>
      <thead className="bg-gray-100 text-gray-800 font-medium">
        <tr>
          <th className="px-4 py-2 text-center">ISBN</th>
          <th className="px-4 py-2 text-center">Title</th>
          <th className="px-4 py-2 text-center">Author</th>
          <th className="px-4 py-2 text-center">Genre</th>
          <th className="px-4 py-2 text-center">Copies</th>
          <th className="px-4 py-2 text-center">Available</th>
          <th className="px-4 py-2 text-center">Actions</th>
        </tr>
      </thead>

      <tbody>
        {books
          .filter((book) => {
            const term = search.toLowerCase();
            return (
              term === "" ||
              book.title.toLowerCase().includes(term) ||
              book.author.toLowerCase().includes(term) ||
              book.isbn.toLowerCase().includes(term) ||
              book.genre.toLowerCase().includes(term)
            );
          })
          .map((book) => (
            <tr
              key={book.isbn}
              className="border-t hover:bg-blue-300  hover:scale-105 hover:shadow-lg transition-all"
            >
              <td className="px-4 py-2 text-center">{book.isbn}</td>
              <td className="px-4 py-2 text-center">{book.title}</td>
              <td className="px-4 py-2 text-center">{book.author}</td>
              <td className="px-4 py-2 text-center">{book.genre}</td>
              <td className="px-4 py-2 text-center">{book.copies}</td>
              <td className="px-4 py-2 text-center">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    book.available > 0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {book.available > 0 ? "Available" : "Unavailable"}
                </span>
              </td>
              <td className="px-4 py-2 text-center">
                <div className="flex justify-center gap-2 flex-wrap">
                  <button
                    className="bg-blue-600 hover:bg-blue-500 hover:scale-105 text-white px-3 py-1 rounded text-sm"
                    onClick={() => onView(book.isbn)}
                  >
                    View
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-500 hover:scale-105 text-white px-3 py-1 rounded text-sm"
                    onClick={() => onDelete(book.isbn)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
      </tbody>
    </>
  );
};

export default BookTable;
