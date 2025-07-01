const books = require('./books');
const { nanoid } = require('nanoid');

// Add a book handler
const addBooksHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // Validation: name cannot be empty
  if (!name || name.trim() === '') {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);
  }
  // Validation: readPage cannot be greater than pageCount
  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  // Create a new book object
  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };
    // Add the new book to the books array
  books.push(newBook);
  // Check if the book was added successfully
  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    }).code(201);
  }
  // If the book was not added, return an error response
  return h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  }).code(500);
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  let filteredBooks = books;

  // Filter by name (case-insensitive)
  if (name) {
    filteredBooks = filteredBooks.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase()));
  }

  // Filter by reading (0 = false, 1 = true)
  if (reading !== undefined) {
    const isReading = reading === '1';
    filteredBooks = filteredBooks.filter((book) => book.reading === isReading);
  }

  // Filter by finished (0 = false, 1 = true)
  if (finished !== undefined) {
    const isFinished = finished === '1';
    filteredBooks = filteredBooks.filter((book) => book.finished === isFinished);
  }

  const responseBooks = filteredBooks.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  return h.response({
    status: 'success',
    data: {
      books: responseBooks,
    },
  }).code(200);
};

// Get book detail by ID handler
const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  // Find the book with the given ID
  const book = books.find((b) => b.id === bookId);
  // If the book is not found, return a 404 error
  if (!book) {
    return h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    }).code(404);
  }
  // If the book is found, return its details
  return h.response({
    status: 'success',
    data: {
      book,
    },
  }).code(200);
};

// Update book handler
const updateBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // Validation: name cannot be empty
  if (!name || name.trim() === '') {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    }).code(400);
  }
  // Validation: readPage cannot be greater than pageCount
  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const updatedAt = new Date().toISOString();
  const finished = pageCount === readPage;

  // Find the index of the book to update
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt,
    };

    // Check if the book was updated successfully
    return h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    }).code(200);
  }

  // If the book is not found, return a 404 error
  return h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  }).code(404);
};

// Delete book handler
const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  // Find the index of the book to delete
  const index = books.findIndex((book) => book.id === bookId);
  // If the book is found, remove it from the array
  if (index !== -1) {
    books.splice(index, 1);
    return h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    }).code(200);
  }

  // If the book is not found, return a 404 error
  return h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  }).code(404);
};

// Export the handler
module.exports = {
  addBooksHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
  deleteBookByIdHandler,
};
