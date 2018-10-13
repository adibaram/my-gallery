console.log('Starting up');

'use strict';

// CRUDL - Create, Read, Update, Delete, List
var gProgs = [
{"id": "touch nums",
"name": "Touch Nums",
"title": "Touch the numbers",
"desc": "lorem ipsum lorem ipsum lorem ipsum", "url": "projs/sokoban",
"publishedAt": 1448693940000,
"labels": ["game", "speed"]},

{"id": "ball board",
"name": "Ball Board",
"title": "Touch the numbers",
"desc": "lorem ipsum lorem ipsum lorem ipsum", "url": "projs/sokoban",
"publishedAt": 1448693940000,
"labels": ["keyboard events", "speed"]},  
];
// var gProjIdCount = 0; 

// function createBook(title, price, imgUrl) {
//     return {
//         id: createBookId(),
//         title: title,
//         price: price,
//         imgUrl: imgUrl,
//         rate: 0
//     }
// }


// const PAGE_SIZE = 5;
// var gCurrPageNo = 0;

// function createBooks() {
//     gBooks = [
//     createBook('Harry Potter', 19.9, 'https://images.gr-assets.com/books/1474154022l/3.jpg'),
//     createBook('The Giving Tree', 14.9, 'https://images.gr-assets.com/books/1174210942l/370493.jpg'), 
//     createBook('The Hunger Gamse', 22, 'https://images.gr-assets.com/books/1447303603l/2767052.jpg') 
//     ]
// }


function getProjById(projId) {
    return gProjs.find(function(proj){
        return proj.id === projId;
    })
}

function deleteProj(projId) {
    var projIdx = gProjs.findIndex(function(proj){
        return proj.id === projId;
    })
    gBooks.splice(projIdx, 1)
    
}

// function addBook(book) {
//     gBooks.push(book);
// }

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