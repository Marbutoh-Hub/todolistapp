const books = [];
const RENDER_EVENT = "render-todo";

const SAVED_EVENT = "saved-todo";
const STORAGE_KEY = "TODO_APPS";

function isStorageExist() /* boolean */ {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function beforeDelete() {
  const body = document.querySelector(".drawerPopup");
  body.style.display = "block";
}

function Read() {
  return document.getElementById("checkbook").checked;
}

function undofile(idbook) {
  const bookTarget = getBook(idbook);

  if (bookTarget == null) return;

  bookTarget.isRead = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveBook();
}

function addToRead(idbook) {
  const bookTarget = getBook(idbook);

  if (bookTarget == null) return;
  bookTarget.isRead = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveBook();
}

function deleteBookOk(idbook) {
  const bookTarget = findBookIndex(idbook);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveBook();
}

function deleteBook(idbook) {
  beforeDelete();
  var height = books.length;
  if (height < 5) {
    var heightY = 5000;
    var heightYfix = String(heightY);
    var mT = String(2000);
  } else {
    var heightY = height * 5000;
    var heightYfix = String(heightY);
    var mT = String(heightYfix);
  }

  const body = document.querySelector(".drawerPopup");
  body.style.height = heightYfix + "px";
  body.style.marginTop = "-" + mT + "px";

  const btnOke = document.getElementById("oke");
  const cariBuku = document.querySelector(".popUp");
  const cariBuku2 = document.querySelector(".popUp2");
  const btn2 = document.getElementById("oke2");
  cariBuku.style.display = "flex";
  btnOke.addEventListener("click", function () {
    const bookTarget = findBookIndex(idbook);
    if (bookTarget === -1) return;
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBook();
    // if (height < 5) {
    //   var heightY = 5000;
    //   var heightYfix = String(heightY);
    //   var mT = String(2000);
    // } else {
    //   var heightY = height * 5000;
    //   var heightYfix = String(heightY);
    //   var mT = String(heightYfix);
    // }
    const body = document.querySelector(".drawerPopup");
    // body.style.height = heightYfix + "px";
    // body.style.marginTop = "-" + mT + "px";
    sweetAlertConfirmation(cariBuku);
    cariBuku2.style.display = "flex";
    btn2.addEventListener("click", function () {
      cariBuku2.style.display = "none";
      body.style.display = "none";
    });
  });
}

function sweetAlertConfirmation(val1) {
  val1.style.display = "none";
}

function findBookIndex(idbook) {
  for (const index in books) {
    if (books[index].id === idbook) {
      return index;
    }
  }

  return -1;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener("DOMContentLoaded", function () {
  const submitBook = document.getElementById("form");
  submitBook.addEventListener("submit", function (Event) {
    Event.preventDefault();
    addBook();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function addBook() {
  const bookName = document.getElementById("title").value;
  const bookCreated = document.getElementById("created").value;
  const bookYear = document.getElementById("year").value;
  const generatedID = Math.random();
  const bookObject = generateBookObject(generatedID, bookName, bookCreated, bookYear, Read());
  books.push(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveBook();
}

function generateBookObject(id, bookName, bookCreated, bookYear, isRead) {
  return {
    id,
    bookName,
    bookCreated,
    bookYear,
    isRead,
  };
}

function createList(bookObject) {
  const judulBuku = document.createElement("h4");
  const penulisBuku = document.createElement("span");
  const tahunBuku = document.createElement("h6");
  const coverBuku = document.createElement("img");
  const cover = document.createElement("div");
  const bodyBuku = document.createElement("div");
  const container = document.createElement("div");

  judulBuku.innerText = bookObject.bookName;
  penulisBuku.innerText = bookObject.bookCreated;
  tahunBuku.innerText = bookObject.bookYear;
  coverBuku.src = "assets/icon/Bookcover.jpg";

  cover.setAttribute("class", "cover");
  cover.append(coverBuku);
  bodyBuku.append(judulBuku, penulisBuku, tahunBuku);
  bodyBuku.setAttribute("class", "isi");

  container.setAttribute("class", "containers-book-unread");
  container.setAttribute("id", `book-${bookObject.id}`);
  container.append(cover, bodyBuku);
  const action = document.createElement("div");
  const btnUncheck = document.createElement("button");
  btnUncheck.classList.add("uncheck");
  action.append(btnUncheck);
  container.append(action);
  action.setAttribute("class", "action2");
  btnUncheck.addEventListener("click", function () {
    addToRead(bookObject.id);
  });

  if (bookObject.isRead) {
    const btnUndo = document.createElement("button");
    btnUndo.addEventListener("click", function () {
      undofile(bookObject.id);
    });
    const btnDelete = document.createElement("button");

    btnDelete.addEventListener("click", function () {
      // const body1 = document.getElementsByTagName("*");
      // body1[0].style.overflowY = "hidden";
      deleteBook(bookObject.id);
    });

    btnUndo.classList.add("undo");
    btnDelete.classList.add("hapus");
    cover.setAttribute("class", "cover");
    container.classList.replace("containers-book-unread", "containers-book-isRead");
    bodyBuku.classList.replace("isi", "isi-isRead");
    action.classList.replace("action2", "action");
    action.append(btnUndo, btnDelete);
    btnUncheck.style.display = "none";
    container.append(action);
  }
  return container;
}

function getBook(idbook) {
  for (const bookItem of books) {
    if (bookItem.id === idbook) {
      return bookItem;
    }
  }
  return null;
}

function saveBook() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

document.addEventListener(RENDER_EVENT, function () {
  console.log(books);
  const unread = document.getElementById("bsd");
  unread.innerHTML = "";

  const clear = document.getElementById("sdb");
  clear.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = createList(bookItem);
    bookItem.isRead ? clear.append(bookElement) : unread.append(bookElement);
  }
});
