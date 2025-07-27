import React, { useEffect, useState } from 'react';
import { getAllBooks } from '../services/bookService';
import { getAllReaders } from '../services/readerService';
import { getActiveLendings } from '../services/lendingService';
import type { Book } from "../types/Book";
import type { Reader } from "../types/Reader";
import type { Lending } from "../types/Lending";

const Dashboard = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [readers, setReaders] = useState<Reader[]>([]);
  const [lendings, setLendings] = useState<Lending[]>([]);
  const [todayLendings, setTodayLendings] = useState<Lending[]>([]);
  const [returnsToday, setReturnsToday] = useState<Lending[]>([]);
  const [overdues, setOverdues] = useState<Lending[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const bookData = await getAllBooks();
      const readerData = await getAllReaders();
      const lendingData = await getActiveLendings();

      setBooks(bookData);
      setReaders(readerData);
      setLendings(lendingData);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayLent = lendingData.filter(l => new Date(l.lentDate).getTime() >= today.getTime());
      setTodayLendings(todayLent);

      const todayReturned = lendingData.filter(l => l.returned);
      console.log(lendingData[0].returned)
      console.log(todayReturned)
      setReturnsToday(todayReturned);

      const overdue = lendingData.filter(l =>
        !l.returned && new Date(l.dueDate).getTime() < new Date().getTime()
      );
      setOverdues(overdue);
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📊 Library Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="📚 Total Books" value={books.length} color="bg-blue-100" />
        <StatCard title="👤 Total Readers" value={readers.length} color="bg-green-100" />
        <StatCard title="📕 Lent Today" value={todayLendings.length} color="bg-yellow-100" />
        <StatCard title="⚠️ Overdue Books" value={overdues.length} color="bg-red-100" />
        <StatCard title="📬 Returns Today" value={returnsToday.length} color="bg-purple-100" />
        <StatCard title="📦 Total Lendings" value={lendings.length} color="bg-gray-200" />
      </div>

      {/* Optional Activity Log */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">📌 Today's Lending Activity</h2>
        <div className="bg-white shadow p-4 rounded-lg max-h-64 overflow-y-auto">
          {todayLendings.length === 0 ? (
            <p className="text-gray-500">No books lent today.</p>
          ) : (
            todayLendings.map((lending, index) => (
              <div key={index} className="mb-3">
                <p>
                  <strong>{lending.reader?.name}</strong> borrowed <span className="text-blue-600">{lending.book?.title}</span>
                </p>
                <p className="text-sm text-gray-500">{new Date(lending.lentDate).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({
  title,
  value,
  color
}: {
  title: string;
  value: number;
  color: string;
}) => (
  <div className={`p-5 rounded-lg shadow ${color}`}>
    <p className="text-sm text-gray-600">{title}</p>
    <h2 className="text-2xl font-bold">{value}</h2>
  </div>
);

export default Dashboard;
