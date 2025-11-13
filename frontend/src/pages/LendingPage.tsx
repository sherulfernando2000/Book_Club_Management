import React, { useEffect, useState } from "react";
import { getAllBooks } from "../services/bookService";
import { getAllReaders } from "../services/readerService";
import {
  lendBook,
  getActiveLendings,
  returnBook,
} from "../services/lendingService";
import type { Book } from "../types/Book";
import type { Reader } from "../types/Reader";
import type { Lending } from "../types/Lending";
import axios from "axios";
import toast from "react-hot-toast";
import { showConfirmation  } from "../components/ConfirmationToast";
import { BookOpenCheck, Search } from "lucide-react";
import LendingTable from "../components/tables/LendingTable"

const LendingPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [readers, setReaders] = useState<Reader[]>([]);
  // const [selectedBook, setSelectedBook] = useState<string>("");
  // const [selectedReader, setSelectedReader] = useState<string>("");
  const [activeLendings, setActiveLendings] = useState<Lending[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [readerDetails, setReaderDetails] = useState({
    _id: "",
    mobile: "",
    name: "",
    readerId: "",
  });

  const [bookDetails, setBookDetails] = useState({
    isbn: "",
    title: "",
    copies: 0,
    

  });

  const [dueDate,setDueDate] = useState("")
  const [showLendForm, setShowLendForm] = useState(false)
  const [search, setSearch] = useState("")

  // const fetchData = async () => {
  //   // const [booksData, readersData, lendingsData] = await Promise.all([
  //   //   getAllBooks(),
  //   //   getAllReaders(),
  //   //   getActiveLendings(),
  //   // ]);
  //   const booksData = await getAllBooks()
  //   const readersData = await getAllReaders()
  //   const lendingsData =  await getActiveLendings()

  //   setBooks(booksData);
  //   setReaders(readersData);
  //   setActiveLendings(lendingsData);
  // };

  const fetchAllBooks = async () => {
    try {
      const result = await getAllBooks();
      setBooks(result);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      //
    }
  };

  const fetchAllReaders = async () => {
    try {
      const result = await getAllReaders();
      setReaders(result);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      // setIsReaderLoading(false);
    }
  };

  const fetchActiveLendings = async () => {
    try {
      const result = await getActiveLendings();
      setActiveLendings(result);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.message);
      } else {
        toast.error("Failed to fetch lendings");
      }
    }
  };

  useEffect(() => {
    // fetchData();
    fetchAllBooks();
    fetchAllReaders();
    fetchActiveLendings();
  }, []);

  const handleLend = async () => {
    if (!bookDetails || !readerDetails) return;
    setLoading(true);
    try {
      await lendBook(bookDetails.isbn, readerDetails._id, dueDate);
      // setSelectedBook("");
      setReaderDetails({
        _id: "",
        mobile: "",
        name: "",
        readerId: "",
      });
      //setSelectedReader("");
      setBookDetails({
        isbn: "",
        title: "",
        copies: 0,
      });
      setDueDate(""); 
      await fetchActiveLendings();
      console.log("success");
    } catch (error) {
      console.error("Lend Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (lendingId: string) => {
    const confirmed = await showConfirmation({
    message: "Are you sure you want to return this book?",
    confirmText: "Return Book"
  });

  if (!confirmed) return;

  try {
    setLoading(true);
    await returnBook(lendingId);
    await fetchActiveLendings();
    await fetchAllBooks();
    toast.success("Book returned successfully!");
  } catch (error) {
    toast.error("Failed to return book");
    console.error(error);
  } finally {
    setLoading(false);
  }
  };

  

  return (
    <div className="h-full overflow-y-auto px-4 py-6">
      <div className="flex gap-2 items-center justify-center">
           <BookOpenCheck className="w-6 h-6 text-black" />
           <h1 className="text-2xl font-bold ">LEND A BOOK</h1>
      </div>
      

      {/* search bar */}
       <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-end mb-4 gap-4">
        <div className="flex-1">
          <label htmlFor="search" className="text-black font-medium mb-1">
            Search
          </label>
          <div className="relative">
            <input
              id="search"
              type="text"
              placeholder="Search Lending..."
              className="border border-neutral-300 p-2 pr-10 rounded w-full hover:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

      {/* add lend book container */}
      <button className="bg-blue-600 text-white px-3 py-2 rounded" onClick={()=> setShowLendForm(!showLendForm)}>{showLendForm? "Add lenging":"Add lending"}</button>
        
      </div>

      {showLendForm && <div id="lendToggle" >
        <div className="space-y-6">
        {/* Reader Details Section */}
        <div>
          <h2 className="text-lg font-bold mb-4">Reader Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block mb-1 font-medium">Mobile No</label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter mobile no."
                value={readerDetails.mobile}
                onChange={(e) => {
                  const mobile = e.target.value;
                  console.log(mobile);
                  setReaderDetails({ ...readerDetails, mobile });
                  console.log(readerDetails.mobile);
                  // Auto-fill when mobile matches a reader
                  if (mobile.length >= 10) {
                    const foundReader = readers.find((r) => r.phone === mobile);
                    if (foundReader) {
                      setReaderDetails({
                        _id: foundReader._id,
                        mobile: foundReader.phone,
                        name: foundReader.name,
                        readerId: foundReader.readerId,
                      });
                    }
                  }
                }}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Name</label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter Name"
                value={readerDetails.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setReaderDetails({ ...readerDetails, name });
                  // Auto-fill when name matches a reader
                  if (name.length >= 3) {
                    const foundReader = readers.find((r) =>
                      r.name.toLowerCase().includes(name.toLowerCase())
                    );
                    if (foundReader) {
                      setReaderDetails({
                        _id: foundReader._id,
                        mobile: foundReader.phone,
                        name: foundReader.name,
                        readerId: foundReader.readerId,
                      });
                    }
                  }
                }}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Reader ID</label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded"
                value={readerDetails.readerId}
                onChange={(e) => {
                  const readerId = e.target.value;
                  setReaderDetails({ ...readerDetails, readerId });
                  // Auto-fill when readerId matches
                  const foundReader = readers.find(
                    (r) => r.readerId === readerId
                  );
                  if (foundReader) {
                    setReaderDetails({
                      _id: foundReader._id,
                      mobile: foundReader.phone,
                      name: foundReader.name,
                      readerId: foundReader.readerId,
                    });
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Book Details Section */}
        <div>
          <h2 className="text-lg font-bold mb-4">Book Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block mb-1 font-medium">ISBN</label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded"
                value={bookDetails.isbn}
                placeholder="Enter ISBN"
                onChange={(e) => {
                  const isbn = e.target.value;
                  setBookDetails({ ...bookDetails, isbn });
                  // Auto-fill when ISBN matches
                  const foundBook = books.find((b) => b.isbn === isbn);
                  if (foundBook) {
                    setBookDetails({
                      isbn: foundBook.isbn,
                      title: foundBook.title,
                      copies: foundBook.copies,
                    });
                  }
                }}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Book Title</label>
              <select
                className="w-full border px-3 py-2 rounded"
                value={bookDetails.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setBookDetails({ ...bookDetails, title });
                  // Auto-fill when title is selected
                  const foundBook = books.find((b) => b.title === title);
                  if (foundBook) {
                    setBookDetails({
                      isbn: foundBook.isbn,
                      title: foundBook.title,
                      copies: foundBook.copies,
                    });
                  }
                }}
              >
                <option value="">-- Select Book --</option>
                {books
                  .filter((book) => book.copies > 0)
                  .map((book) => (
                    <option key={book.isbn} value={book.title}>
                      {book.title}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Available Copies</label>
              <input
                type="number"
                className="w-full border px-3 py-2 rounded"
                value={bookDetails.copies}
                readOnly
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Due Date</label>
              <input
                type="date"
                className="w-full border px-3 py-2 rounded"
                value={dueDate}
                readOnly = {false}
                onChange={(e) => setDueDate( e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleLend}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={!readerDetails.readerId || !bookDetails.isbn || loading}
      >
        {loading ? "Processing..." : "Lend Book"}
      </button>
      </div>
      }

      <h2 className="text-xl font-semibold mt-10 mb-4">Active Lendings</h2>
      <div className="overflow-x-auto mb-8">
        <LendingTable
          activeLendings={activeLendings}
          search={search}
          onReturn={handleReturn}
        />
        
      </div>
    </div>
  );
};

export default LendingPage;
