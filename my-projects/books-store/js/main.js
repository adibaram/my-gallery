'use strict'

function init() {
    createBooks();
    renderBooks();
}

function renderBooks() {
    var books = gBooks;

    var strHtmls = books.map(function (book) {
        return `<tr>
    <th scope="row">${book.id}</th>
    <td>${book.title}</td>
    <td>${book.price} $</td>
    <td>
            <button type="button" class="btn btn-outline-success" data-toggle="modal" 
            data-target=".bd-example-modal-sm" onclick="renderModal(${book.id})">Read</button>

            <button type="button" class="btn btn-outline-primary" 
            onclick="readAndUpdateBook(${book.id})">Update</button>

            <button type="button" class="btn btn-outline-danger" onclick="onDeleteBook(${book.id})">Delete</button>
    </td>
    </tr>`
    });
    $('.books-list').html(strHtmls.join(''))
}

function onDeleteBook(bookId) {
    deleteBook(bookId);
    renderBooks();
}

function readAndAddNewBook() {
    var bookName = prompt(`Book's name`);
    var bookPrice = +prompt(`Book's price`);
    var bookUrl = prompt(`Book's cover image (url)`);
    var book = createBook(bookName, bookPrice, bookUrl);
    addBook(book);
    renderBooks();
}

function readAndUpdateBook(bookId) {
    var bookNewPrice = prompt(`Book's new price`);
    if (bookNewPrice === null || bookNewPrice.trim() === '') {
        bookNewPrice = getBookById(bookId).price;
    } else {
        bookNewPrice = +bookNewPrice;
    }
    updateBookPrice(bookId, bookNewPrice);
    renderBooks();
}

function renderModal(bookId) {
    var bookInfo = getBookById(bookId);
    var bookTitle = bookInfo.title;
    var bookPrice = bookInfo.price;

    var elModal = document.querySelector('.modal-content');
    elModal.innerHTML = `Title: ${bookTitle}`;
    elModal.innerHTML += `<br>`;
    elModal.innerHTML += `Price: ${bookPrice} $`;
    elModal.innerHTML += `<br>`;
    elModal.innerHTML += `<br>`;
    elModal.innerHTML += `<div class="btn-group" role="group" aria-label="Basic example">
            <button type="button" class="btn btn-secondary" onclick="onDisLikeBtn(${bookInfo.id})" >-</button>
            <button type="button" class="btn btn-secondary">${bookInfo.rate}</button>
            <button type="button" class="btn btn-secondary" onclick="onLikeBtn(${bookInfo.id})" >+</button>
            </div>`
    elModal.innerHTML += `<br>`;
    elModal.innerHTML += `<img src="${bookInfo.imgUrl}" alt="Smiley face">`

}

function onLikeBtn(id) {
    if (getBookById(id).rate < 9) {
        getBookById(id).rate++;
        renderModal(id);
    }
}

function onDisLikeBtn(id) {
    if (getBookById(id).rate > 0) {
        getBookById(id).rate--;
        renderModal(id);
    }
}
