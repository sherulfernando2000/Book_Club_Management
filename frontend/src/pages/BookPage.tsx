import  { useEffect, useState } from "react";
import { BookOpen, Search } from "lucide-react";
import type { Book } from "../types/Book";
import BookTable from "../components/tables/BookTable";
import BookForm from "../components/forms/BookForm";
import {
  addBook,
  deleteBook,
  getAllBooks,
  updateBook,
} from "../services/bookService";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../context/useAuth";



const BooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [isBookLoading, setIsBookLoading] = useState(false);
  const { isAuthenticating, isLoggedIn } = useAuth();

  const fetchAllBooks = async () => {
    try {
      setIsBookLoading(true);
      const result = await getAllBooks();
      setBooks(result);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsBookLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticating && isLoggedIn) {
      fetchAllBooks();
    }
  }, []);

  const handleAddBook = () => {
    setCurrentBook(null);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setCurrentBook(null);
  };

  
  const handleViewBook = (isbn: string) => {
    const book = books.find((b) => b.isbn === isbn);
    if (book) {
      setCurrentBook(book);
      setShowPopup(true);
    }
  };

  const handleDeleteBook = async (isbn: string) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await deleteBook(isbn);
        fetchAllBooks();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.message);
        } else {
          toast.error("Something went wrong");
        }
      }
    }
  };

  const handleSaveBook = (
    bookData: Omit<Book, "createdAt" | "updatedAt">
  ) => {
    setIsSaving(true);

    setTimeout(async () => {
      if (currentBook) {
        // Update existing book
        try {
          const updatedBook = await updateBook(currentBook.isbn, bookData);
          setBooks((prev) =>
            prev.map((book) =>
              book.isbn === currentBook.isbn ? updatedBook : book
            )
          );
        } catch (error) {
          if (axios.isAxiosError(error)) {
            
            toast.error(error.message);
          } else {
            toast.error("Something went wrong");
          }
        }
      } else {
        // Add new book
        try {
          const newBook = await addBook(bookData);
          setBooks((prev) => [...prev, newBook]);
        } catch (error) {
          if (axios.isAxiosError(error)) 
            {
            const errorMsg = error.response?.data?.message || error.message;
            console.log("message"+errorMsg)
            toast.error(errorMsg);
          } else {
            toast.error("Something went wrong");
          }
        }
      }

      setIsSaving(false);
      setShowPopup(false);
    }, 1000);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center flex items-center justify-center gap-2 text-black">
        <BookOpen className="w-6 h-6" />
        All Books
      </h1>

      {/* Search bar and button to Add book */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-end mb-4 gap-4">
        <div className="flex-1">
          <label htmlFor="search" className="text-black font-medium mb-1">
            Search
          </label>
          <div className="relative">
            <input
              id="search"
              type="text"
              placeholder="Search book..."
              className="border border-neutral-300 p-2 pr-10 rounded w-full hover:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        <button
          onClick={handleAddBook}
          className="bg-green-500 text-white px-4 py-2 rounded w-full sm:w-auto"
        >
          Add Book
        </button>
      </div>

      <div className="border-b-2 black"></div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <BookTable
            books={books}
            search={search}
            onView={handleViewBook}
            onDelete={handleDeleteBook}
          />
        </table>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-[1000] p-4">
          <BookForm
            book={currentBook}
            isEditing={!!currentBook}
            onSave={handleSaveBook}
            onClose={handleClosePopup}
            isSaving={isSaving}
          />
        </div>
      )}
    </div>
  );
};

export default BooksPage;
