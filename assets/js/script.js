const books = [];
const RENDER_EVENT = "render-todo";

function Read() {
  return document.getElementById("checkbook").checked;
}

function undofile(idbook) {
  const bookTarget = getBook(idbook);

  if (bookTarget == null) return;

  bookTarget.isRead = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener("DOMContentLoaded", function () {
  const submitBook = document.getElementById("form");
  submitBook.addEventListener("submit", function (Event) {
    Event.preventDefault();
    addBook();
  });
});

function addBook() {
  const bookName = document.getElementById("title").value;
  const bookCreated = document.getElementById("created").value;
  const bookYear = document.getElementById("year").value;
  const generatedID = Math.random();
  const bookObject = generateBookObject(generatedID, bookName, bookCreated, bookYear, Read());
  books.push(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
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

  if (bookObject.isRead) {
    const action = document.createElement("div");
    const btnUndo = document.createElement("button");
    btnUndo.addEventListener("click", function () {
      undofile(bookObject.id);
    });
    const btnDelete = document.createElement("button");

    btnUndo.classList.add("undo");
    btnDelete.classList.add("hapus");
    cover.classList.replace("cover", "coverisRead");
    container.classList.replace("containers-book-unread", "containers-book-isRead");
    bodyBuku.classList.replace("isi", "isi-isRead");
    action.setAttribute("class", "action");
    action.append(btnUndo, btnDelete);
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
