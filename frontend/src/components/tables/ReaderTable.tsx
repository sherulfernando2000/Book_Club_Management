import React from "react";
import  type {Reader}  from "../../types/Reader";

interface ReaderTableProps {
  readers: Reader[];
  search: string;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

const ReaderTable: React.FC<ReaderTableProps> = ({ readers, search, onView, onDelete }) => {
  return (
    <div className="relative top-8">
      <div className="titles grid grid-cols-6 mb-2 font-medium p-2 bg-gray-100 rounded">
        <h3 className="text-center">Reader ID</h3>
        <h3 className="text-center">Name</h3>
        <h3 className="text-center">Email</h3>
        <h3 className="text-center">Phone</h3>
        <h3 className="text-center">Status</h3>
        <h3 className="text-center">Actions</h3>
      </div>

      <div className="readers">
        {readers
          .filter((reader) => {
            const searchTerm = search.toLowerCase();
            return (
              searchTerm === "" ||
              reader.name.toLowerCase().includes(searchTerm) ||
              reader.email.toLowerCase().includes(searchTerm) ||
              reader.phone.includes(searchTerm) ||
              reader.readerId.toLowerCase().includes(searchTerm)
            );
          })
          .map((reader) => (
            <div
              key={reader.readerId}
              className="grid grid-cols-6 items-center p-2 border border-neutral-300 rounded-lg mb-2 hover:bg-gray-300"
            >
              <div className="text-center">{reader.readerId}</div>
              <div className="text-center">{reader.name}</div>
              <div className="text-center">{reader.email}</div>
              <div className="text-center">{reader.phone}</div>
              <div className="text-center">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  reader.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {reader.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-center gap-2">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                  onClick={() => onView(reader.readerId)}
                >
                  View
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                  onClick={() => onDelete(reader.readerId)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ReaderTable;