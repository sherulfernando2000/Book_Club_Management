import React from "react";
import  type {Reader}  from "../../types/Reader";

interface ReaderFormProps {
  reader?: Reader | null;
  isEditing: boolean;
  onSave: (reader: Omit<Reader, "readerId" | "createdAt" | "updatedAt">) => void;
  onClose: () => void;
  isSaving: boolean;
}

const ReaderForm: React.FC<ReaderFormProps> = ({ 
  reader, 
  isEditing, 
  onSave, 
  onClose, 
  isSaving 
}) => {
  const [name, setName] = React.useState(reader?.name || "");
  const [email, setEmail] = React.useState(reader?.email || "");
  const [phone, setPhone] = React.useState(reader?.phone || "");
  const [address, setAddress] = React.useState(reader?.address || "");
  const [isActive, setIsActive] = React.useState(reader?.isActive ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      email,
      phone,
      address,
      isActive,
    });
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col w-full">
          <h2 className="text-2xl font-bold flex items-center gap-2 justify-center">
            {isEditing ? "EDIT READER" : "ADD READER"}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-red-400 rounded-full p-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="black"
          >
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
          </svg>
        </button>
      </div>

      <form className="text-sm" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Reader ID (for editing) */}
          {isEditing && reader && (
            <div>
              <label className="block text-black mb-1">Reader ID</label>
              <input
                type="text"
                className="bg-gray-200 border border-gray-300 p-2 rounded-full w-full"
                value={reader.readerId}
                readOnly
              />
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-black mb-1">Name</label>
            <input
              type="text"
              className="bg-blue-200 border border-blue-300 hover:border-blue-500 p-2 rounded-full w-full focus:outline-none focus:border-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-black mb-1">Email</label>
            <input
              type="email"
              className="bg-blue-200 border border-blue-300 hover:border-blue-500 p-2 rounded-full w-full focus:outline-none focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-black mb-1">Phone</label>
            <input
              type="text"
              className="bg-blue-200 border border-blue-300 hover:border-blue-500 p-2 rounded-full w-full focus:outline-none focus:border-blue-500"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          {/* Address */}
          <div className="sm:col-span-2">
            <label className="block text-black mb-1">Address</label>
            <input
              type="text"
              className="bg-blue-200 border border-blue-300 hover:border-blue-500 p-2 rounded-full w-full focus:outline-none focus:border-blue-500"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-black mb-1">Status</label>
            <select
              className="bg-blue-200 border border-blue-300 hover:border-blue-500 p-2 rounded-full w-full focus:outline-none focus:border-blue-500"
              value={isActive ? "active" : "inactive"}
              onChange={(e) => setIsActive(e.target.value === "active")}
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReaderForm;