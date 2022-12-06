const books = [];

const STORAGE_KEY = "Bookshelf_Apps";
const SAVED_EVENT = "savedBookshelf";
const RENDER_EVENT = "renderBookshelf";
const INCOMPLETE_BOOKSHEL_FLIST = "incompleteBookshelfList";
const COMPLETE_BOOKSHELF_LIST = "completeBookshelfList"; 

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

function findBook(bookId) {
  for (bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }

  return null;
}

function findBookIndex(bookId) {
  for (let index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (let book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {
  const bookTitle = document.createElement("h2");
  bookTitle.innerText = bookObject.title;

  const bookAuthor = document.createElement("p");
  bookAuthor.innerText = bookObject.author;

  const bookYear = document.createElement("p");
  bookYear.innerText = bookObject.year;

  const bookContainer = document.createElement("article");
  bookContainer.classList.add("book_item");
  bookContainer.append(bookTitle, bookAuthor, bookYear);
  bookContainer.setAttribute("id", `book-${bookObject.id}`);

  const bookAction = document.createElement("div");
  bookAction.classList.add("action");

  if (bookObject.isCompleted) {
    const unfinishedBtn = document.createElement("button");
    unfinishedBtn.innerText = "Belum selesai di Baca";
    unfinishedBtn.classList.add("green");
    unfinishedBtn.addEventListener("click", function () {
      let confirmBox = confirm("Apakah kamu ingin memindahkannya?");
      if (confirmBox === true) {
        swal("Success", "Buku telah berhasil dipindahkan", "success");
        undoBookFromCompleted(bookObject.id);
      }
    });

    const removeBtn = document.createElement("button");
    removeBtn.innerText = "Hapus buku";
    removeBtn.classList.add("red");
    removeBtn.addEventListener("click", function () {
      let confirmBox = confirm("Apakah kamu ingin menghapusnya?");
      if (confirmBox !== false) {
        swal("Success", "Buku telah berhasil dihapus", "success");
        removeBookFromCompleted(bookObject.id);
      }
    });
    
    bookAction.append(unfinishedBtn, removeBtn);
    bookContainer.append(bookAction);
  } else {
    const finishedBtn = document.createElement("button");
    finishedBtn.innerText = "Selesai dibaca";
    finishedBtn.classList.add("green");
    finishedBtn.addEventListener("click", function () {
      let confirmBox = confirm("Apakah kamu ingin memindahkannya?");
      if (confirmBox === true) {
        swal("Success", "Buku telah berhasil dipindahkan", "success");
        addBookFromCompleted(bookObject.id);
      }
    });

    const removeBtn = document.createElement("button");
    removeBtn.innerText = "Hapus buku";
    removeBtn.classList.add("red");
    removeBtn.addEventListener("click", function () {
      let confirmBox = confirm("Apakah kamu ingin menghapusnya?");
      if (confirmBox !== false) {
        swal("Success", "Buku telah berhasil dihapus", "success");
        removeBookFromCompleted(bookObject.id);
      }
    });

    bookAction.append(finishedBtn, removeBtn);
    bookContainer.append(bookAction);
  }
  
  return bookContainer;
}

function addBook() {
  const inputBookTitle = document.getElementById("inputBookTitle").value;
  const inputBookAuthor = document.getElementById("inputBookAuthor").value;
  const inputBookYear = document.getElementById("inputBookYear").value;
  const inputBookIsComplete = document.getElementById("inputBookIsComplete").checked;

  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID,inputBookTitle,inputBookAuthor,inputBookYear,inputBookIsComplete,false);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();
  swal("Success", "Buku telah berhasil ditambahkan", "success");
}

function changeText(){
  const checkbox = document.getElementById("inputBookIsComplete");
  const textSubmit = document.getElementById("textSubmit");

  if(checkbox.checked !== false){
      textSubmit.innerText = "Selesai dibaca";
  }else{
      textSubmit.innerText = "Belum selesai dibaca";
  }
};

function addBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget === null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();
}

function removeBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);
  if (bookTarget === -1) return;
  books.splice(bookTarget, 1);

  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget === null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(RENDER_EVENT, function () {
  const incompletedBookList = document.getElementById(INCOMPLETE_BOOKSHEL_FLIST);
  incompletedBookList.innerHTML = "";

  const completeBookList = document.getElementById(COMPLETE_BOOKSHELF_LIST);
  completeBookList.innerHTML = "";

  for (bookItem of books) {
    const bookElement = makeBook(bookItem);

    if (bookItem.isCompleted !== true) {
      incompletedBookList.append(bookElement);
    } else {
      completeBookList.append(bookElement);
    }
  }
});

document.addEventListener(SAVED_EVENT, () => {
  console.log(localStorage.getItem(STORAGE_KEY));
});

const searchBook = document.getElementById("searchSubmit");
searchBook.addEventListener("click", function (event) {
  event.preventDefault();

  const searchBookTitle = document.getElementById("searchBookTitle").value;
  const bookItem = document.querySelectorAll(".book_item");

  for (let book of bookItem) {
    const bookTitle = book.innerText;

    if (bookTitle.trim().toUpperCase().includes(searchBookTitle) || bookTitle.trim().toLowerCase().includes(searchBookTitle)) {
      book.style.display = "block";
    } else {
      book.style.display = "none";
    }
  }
});
