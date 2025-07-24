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

const LendingPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [readers, setReaders] = useState<Reader[]>([]);
  const [selectedBook, setSelectedBook] = useState<string>("");
  const [selectedReader, setSelectedReader] = useState<string>("");
  const [activeLendings, setActiveLendings] = useState<Lending[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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
    fetchAllBooks()
    fetchAllReaders()
    fetchActiveLendings()
  }, []);

  const handleLend = async () => {
    if (!selectedBook || !selectedReader) return;
    setLoading(true);
    try {
      await lendBook(selectedBook, selectedReader);
      setSelectedBook("");
      setSelectedReader("");
      // await fetchData();
    } catch (error) {
      console.error("Lend Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (lendingId: string) => {
    setLoading(true);
    try {
      await returnBook(lendingId);
      // await fetchData();
    } catch (error) {
      console.error("Return Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Lend a Book</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block mb-1 font-medium">Select Reader</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={selectedReader}
            onChange={(e) => setSelectedReader(e.target.value)}
          >
            <option value="">-- Select Reader --</option>
            {readers.map((reader) => (
              <option key={reader.readerId} value={reader.readerId}>
                {reader.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Select Book</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={selectedBook}
            onChange={(e) => setSelectedBook(e.target.value)}
          >
            <option value="">-- Select Book --</option>
            {books
              .filter((book) => book.copies > 0)
              .map((book) => (
                <option key={book.isbn} value={book.isbn}>
                  {book.title} ({book.copies} available)
                </option>
              ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleLend}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={!selectedBook || !selectedReader || loading}
      >
        {loading ? "Processing..." : "Lend Book"}
      </button>

      <h2 className="text-xl font-semibold mt-10 mb-4">Active Lendings</h2>
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Reader</th>
              <th className="p-2 border">Book</th>
              <th className="p-2 border">Lent Date</th>
              <th className="p-2 border">Due Date</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {activeLendings.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  No active lendings
                </td>
              </tr>
            )}
            {activeLendings.map((lending) => (
              <tr key={lending._id}>
                <td className="p-2 border">{(lending.reader as Reader).name}</td>
                <td className="p-2 border">{(lending.book as Book).title}</td>
                <td className="p-2 border">
                  {new Date(lending.lentDate).toLocaleDateString()}
                </td>
                <td className="p-2 border">
                  {new Date(lending.dueDate).toLocaleDateString()}
                </td>
                <td className="p-2 border">
                  <button
                    onClick={() => handleReturn(lending._id!)}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Return
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LendingPage;
