// BOOK CLASS : REPRESENT A BOOK
class Book {
   constructor(title, author, isbn) {
      this.title = title;
      this.author = author;
      this.isbn = isbn;
   }
}

// UI Class: Handle UI Tasks
class UI {
   static displayBooks() {
      const books = Store.getBooks();

      // LOOPS THROUGH ALL THE BOOKS AND CALL THE METHOD OF ADD BOOKS TO LIST
      books.forEach((book) => UI.addBookToList(book));
   }

   static addBookToList(book) {
      const list = document.querySelector('#book-list');

      // CREATE A TABLE ROW INSIDE THE TABLE
      const row = document.createElement('tr');
      row.innerHTML = `
         <td>${book.title}</td>
         <td>${book.author}</td>
         <td>${book.isbn}</td>
         <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
      `;
      // APPEND ROW TO THE LIST
      list.appendChild(row);
   }

   static deleteBook(el) {
      if (el.classList.contains('delete')) {
         el.parentElement.parentElement.remove();
      }
   }

   static clearFields() {
      document.querySelector('#title').value = '';
      document.querySelector('#author').value = '';
      document.querySelector('#isbn').value = '';
   }

   static showAlert(message, className) {
      const div = document.createElement('div');
      div.className = `alert alert-${className}`;
      div.appendChild(document.createTextNode(message));
      const container = document.querySelector('.container');
      const form = document.querySelector('#book-form');
      container.insertBefore(div, form);
      // VANISH IN 3 SECONDs
      setTimeout(() => document.querySelector('.alert').remove(), 3000);
   }
}

// STORE CLASS  Handles Storage
class Store {
   static getBooks() {
      let books;
      if (localStorage.getItem('books') === null) {
         books = [];
      } else {
         books = JSON.parse(localStorage.getItem('books'));
      }

      return books;
   }
   static addBook(book) {
      const books = Store.getBooks();

      books.push(book);

      localStorage.setItem('books', JSON.stringify(books));
   }
   static removeBook(isbn) {
      const books = Store.getBooks();
      books.forEach((book, index) => {
         if (book.isbn === isbn) {
            books.splice(index, 1);
         }
      });

      localStorage.setItem('books', JSON.stringify(books));
   }
}

// Events to Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Events to add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
   e.preventDefault();
   // GET FORMS VALUES
   const title = document.querySelector('#title').value;
   const author = document.querySelector('#author').value;
   const isbn = document.querySelector('#isbn').value;

   // VALIDATE
   if (title === '' || author === '' || isbn === '') {
      UI.showAlert('Please Fill In All Fields', 'danger');
   } else {
      // Instatiate Book
      const book = new Book(title, author, isbn);

      // ADD BOOK TO UI
      UI.addBookToList(book);

      // ADD BOOK TO STORE
      Store.addBook(book);

      // SHOW a Success Message
      UI.showAlert('Book Added', 'success');

      // CLEAR FILED
      UI.clearFields();
   }
});

// Event to Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
   // REMOVE book FROM UI
   UI.deleteBook(e.target);

   // REMOVE BOOK FROM LOCAL STORAGE
   Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

   // SHOW a Success Message
   UI.showAlert('Book Removed', 'success');
});
