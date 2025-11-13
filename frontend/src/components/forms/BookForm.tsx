import React from "react";
import type { Book } from "../../types/Book";

interface BookFormProps {
  book?: Book | null;
  isEditing: boolean;
  isSaving: boolean;
  onSave: (book: Omit<Book, "bookId" | "createdAt" | "updatedAt">) => void;
  onClose: () => void;
}

interface BookFormData {
  title: string;
  author: string;
  isbn: string;
  copies: number;
  available: number;
  genre: string;
  publishedYear: number;
}

interface BookFormErrors {
  title?: string;
  author?: string;
  isbn?: string;
  copies?: string;
  available?: string;
  genre?: string;
  publishedYear?: string;
}

const BookForm: React.FC<BookFormProps> = ({
  book,
  isEditing,
  isSaving,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = React.useState<BookFormData>({
    title: book?.title || "",
    author: book?.author || "",
    isbn: book?.isbn || "",
    copies: book?.copies ?? 0,
    available: book?.available ?? 0,
    genre: book?.genre || "",
    publishedYear: book?.publishedYear ?? new Date().getFullYear(),
  });

  const [errors, setErrors] = React.useState<BookFormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: BookFormErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.author.trim()) newErrors.author = "Author is required";

    if (!formData.isbn.trim()) {
      newErrors.isbn = "ISBN is required";
    } else if (!/^\d{10}(\d{3})?$/.test(formData.isbn)) {
      newErrors.isbn = "ISBN must be 10 or 13 digits";
    }

    if (formData.copies < 0) newErrors.copies = "Copies must be 0 or more";
    if (formData.available < 0) newErrors.available = "Available must be 0 or more";
    if (formData.available > formData.copies)
      newErrors.available = "Available cannot exceed total copies";

    if (!formData.genre.trim()) newErrors.genre = "Genre is required";

    if (
      !formData.publishedYear ||
      formData.publishedYear < 1000 ||
      formData.publishedYear > new Date().getFullYear()
    )
      newErrors.publishedYear = "Enter a valid published year";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "copies" || name === "available" || name === "publishedYear"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-center w-full">
          {isEditing ? "EDIT BOOK" : "ADD BOOK"}
        </h2>
        <button onClick={onClose} className="hover:bg-red-600 rounded-full p-1">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="black">
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
          </svg>
        </button>
      </div>

      <form className="text-sm" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Title */}
          <div>
            <label className="block mb-1">Title</label>
            <input
              type="text"
              name="title"
              className="bg-blue-100 border p-2 rounded-lg w-full"
              placeholder="Ex:Harry Potter"
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && <p className="text-red-600">{errors.title}</p>}
          </div>

          {/* Author */}
          <div>
            <label className="block mb-1">Author</label>
            <input
              type="text"
              name="author"
              className="bg-blue-100 border p-2 rounded-lg w-full"
              placeholder="J.K.Rowling"
              value={formData.author}
              onChange={handleChange}
            />
            {errors.author && <p className="text-red-600">{errors.author}</p>}
          </div>

          {/* ISBN */}
          <div>
            <label className="block mb-1">ISBN</label>
            <input
              type="text"
              name="isbn"
              className="bg-blue-100 border p-2 rounded-lg w-full"
              placeholder="Ex:9558875023"
              value={formData.isbn}
              onChange={handleChange}
            />
            {errors.isbn && <p className="text-red-600">{errors.isbn}</p>}
          </div>

          {/* Copies */}
          <div>
            <label className="block mb-1">Total Copies</label>
            <input
              type="number"
              name="copies"
              className="bg-blue-100 border p-2 rounded-lg w-full"
              placeholder="Ex:10"
              value={formData.copies}
              min={0}
              onChange={handleChange}
            />
            {errors.copies && <p className="text-red-600">{errors.copies}</p>}
          </div>

          {/* Available */}
          <div>
            <label className="block mb-1">Available</label>
            <input
              type="number"
              name="available"
              className="bg-blue-100 border p-2 rounded-lg w-full"
              value={formData.available}
              min={0}
              max={formData.copies}
              onChange={handleChange}
            />
            {errors.available && (
              <p className="text-red-600">{errors.available}</p>
            )}
          </div>

          {/* Genre */}
          <div>
            <label className="block mb-1">Genre</label>
            <input
              type="text"
              name="genre"
              className="bg-blue-100 border p-2 rounded-lg w-full"
              placeholder="Ex:children fantasy book"
              value={formData.genre}
              onChange={handleChange}
            />
            {errors.genre && <p className="text-red-600">{errors.genre}</p>}
          </div>

          {/* Published Year */}
          <div>
            <label className="block mb-1">Published Year</label>
            <input
              type="number"
              name="publishedYear"
              className="bg-blue-100 border p-2 rounded-lg w-full"
              value={formData.publishedYear}
              onChange={handleChange}
            />
            {errors.publishedYear && (
              <p className="text-red-600">{errors.publishedYear}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-600 hover:scale-105 text-white px-6 py-2 rounded-full"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookForm;
