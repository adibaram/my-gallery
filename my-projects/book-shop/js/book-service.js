'use strict';

// CRUDL - Create, Read, Update, Delete, List
var gBooks = [];
var gBooksIdCount = 0; 

function createBook(title, price, imgUrl) {
    return {
        id: createBookId(),
        title: title,
        price: price,
        imgUrl: imgUrl,
        rate: 0
    }
}


// const PAGE_SIZE = 5;
// var gCurrPageNo = 0;

function createBooks() {
    gBooks = [
    createBook('Harry Potter', 19.9, 'https://images.gr-assets.com/books/1474154022l/3.jpg'),
    createBook('The Giving Tree', 14.9, 'https://images.gr-assets.com/books/1174210942l/370493.jpg'), 
    createBook('The Hunger Gamse', 22, 'https://images.gr-assets.com/books/1447303603l/2767052.jpg') 
    ]
}


function getBookById(bookId) {
    return gBooks.find(function(book){
        return book.id === bookId;
    })
}

function deleteBook(bookId) {
    var bookIdx = gBooks.findIndex(function(book){
        return book.id === bookId;
    })
    gBooks.splice(bookIdx, 1)
    
}

function addBook(book) {
    gBooks.push(book);
}

function updateBookPrice(bookId, newPrice) {
    var bookIdx = gBooks.findIndex(function(book){
        return book.id === bookId;
    })
    gBooks[bookIdx].price = newPrice;
}

function createBookId() {
    gBooksIdCount++; 
    return gBooksIdCount; 
}


// function updateCar(car) {
    //     var carIdx = gCars.findIndex(function(car){
        //         return car.id === carId;
        //     })
        //     gCars[carIdx] = car;

// }
        
// function goNextPage() {
//     gCurrPageNo++;
// }
        

// function getCars() {
//     var fromCarIdx = gCurrPageNo * PAGE_SIZE;
//     return gCars.slice(fromCarIdx, fromCarIdx+PAGE_SIZE);
// }