/*  global Requests  */

var bookTemplate = $('#templates .book')
var bookTable = $('#bookTable')

var borrowerTemplate = $('#templates .borrower')
var borrowerTable = $('#borrowerTable')

var borrowerOptionTemplate = $('#templates, .borrowerOption')


var libraryID = 129
var requests = new Requests(libraryID)
// var baseURL = `https://floating-woodland-64068.herokuapp.com/libraries/${libraryID}`

// create an array to hold all of the info
var dataModel = {
  //books: [],
  //borrowers: [],
}

// REFACTORING BY GETTING RID OF BASE URL VARIABLE AND REPLACING WITH 'request'
// VARIABLE WHICH REFERENCES THE FUNCTIONS IN THE 'REQUESTS.JS' CLASS


// =============================================================================
//******************CREATE A FUNCTION TO ADD A BOOK TO THE PAGE*****************
// =============================================================================

// ADDS ALL THE BOOK DATA TO A NEW TABLE ROW

//bookData argument is passed in from the API
function addBookToPage(bookData) {

  //using JQuery, clone the book template from index.html
  var book = bookTemplate.clone(true, true)
  //update the book id from the template with a new book id from the API
  book.attr('data-id', bookData.id)
  //update the book title from the template with the book title from the API
  book.find('.bookTitles').text(bookData.title)
  //set the image url for the book from the API
  book.find('.bookImage').attr('src', bookData.image_url)
  //set the image alt to the book title from the API
  book.find('.bookImage').attr('alt', bookData.title)
  //add this data to the table
  bookTable.append(book)

  // SELECT THE CORRECT BORROWER FOR THE BOOKS THAT WERE LOANED
  if(bookData.borrower_id !== null) {
    book.find(`.borrowerOption[value="${bookData.borrower_id}"]`).attr('selected', 'selected')
    incrementBorrowerCount(bookData.borrower_id)
  }
}


// =============================================================================
//********CREATE A FUNCTION TO ADD A BORROWER TO THE BORROWER TABLE*************
// =============================================================================

//borrowerData argument is passed in from the API
function addBorrowerToPage(borrowerData) {
  var fullName = `${borrowerData.firstname} ${borrowerData.lastname}`
  //using JQuery, clone the book template from index.html
  var borrower = borrowerTemplate.clone(true, true)
  //update the book id from the template with a new book id from the API
  borrower.attr('data-id', borrowerData.id)
  //update the book title from the template with the book title from the API
  borrower.find('.borrowerName').text(fullName)
  //add this data to the table
  borrowerTable.prepend(borrower)

  // ADD BORROWER TO THE SELECT DROPDOWN
  var borrowerOption = borrowerOptionTemplate.clone()
  borrowerOption.text(fullName)
  borrowerOption.attr('value', borrowerData.id)
  $('.borrowerSelect').append(borrowerOption)
}


// ==================GET BOOKS FROM API USING REQUESTS.JS FILE==================
var bookPromise = requests.getBooks().then((dataFromServer) => {
  dataModel.books = dataFromServer
})

// =========GET BORROWERS FROM API USING REQUESTS.JS FILE=======================
var borrowerPromise = requests.getBorrowers().then((dataFromServer) => {
  dataModel.borrowers = dataFromServer

})

// create an array to store all books and borrowers
var promises = [bookPromise, borrowerPromise]

Promise.all(promises).then(() => {
  // first add borrowers to page
  dataModel.borrowers.forEach((borrowerData) => {
    addBorrowerToPage(borrowerData)
  })
  //next, add books to page
  dataModel.books.forEach((bookData) => {
    addBookToPage(bookData)
  })
})


// =============================================================================
// =============================ADD BOOKS & BORROWERS===========================
// =============================================================================

// ADD BOOKS TO LIST OF BOOKS
$('#createBookButton').on('click', () => {
  var bookData = {}
  bookData.title = $('.addBookTitle').val()
  bookData.description = $('.addBookDescription').val()
  bookData.image_url = $('.addBookImageURL').val()

  requests.createBook(bookData).then((dataFromServer) => {
    addBookToPage(dataFromServer)
    $(`#addBookModal`).modal('hide')
    $(`#addBookForm`)[0].reset()
  })
})

// Add borrower directly from MODAL
$('#createBorrowerButton').on('click', () => {
  var borrowerData = {}
  borrowerData.firstname = $('.addBorrowerFirstName').val()
  borrowerData.lastname = $('.addBorrowerLasttName').val()


  requests.createBorrower(borrowerData).then((dataFromServer) =>{
    addBorrowerToPage(dataFromServer)
    $(`#addBorrowerModal`).modal('hide')
    $(`#addBorrowerForm`)[0].reset()

  })
})

// =============================================================================
// ===========================DELETE BOOKS & BORROWERS==========================
// =============================================================================

// Delete items when you click the "X"
bookTable.on('click', 'td.btn-xs.btn-danger', function(event) {
  var book = $(event.target).parent()
  var book_id = book.attr('data-id')


  requests.deleteBook({id: book_id}).then(() =>{
    book.remove()
  })
})

// Delete borrower when you click the "X"
borrowerTable.on('click', 'td.btn-xs.btn-danger', function(event) {
  var borrower = $(event.target).parent()
  var borrower_id = borrower.attr('data-id')

  requests.deleteBorrower({id: borrower_id}).then(() => {
    borrower.remove()
  })
})

function findBookModel(bookID) {
  for (var i = 0; i < dataModel.books.length; i++) {
    if(dataModel.books[i].id === bookID) return dataModel.books[i]
  }
}


// Updates the API with the borrower id to tie them to the book borrowed
// when the dropdown is selected or clicked

$('.borrowerSelect').on('change',(event) => {
  var borrowerID = $(event.target).val()
  var bookID = $(event.target).parents('.book').attr('data-id')
  var oldBorrowerID = findBookModel(Number(bookID)).borrower_id
  console.log("The id is " + borrowerID)
  requests.updateBook({borrower_id: borrowerID, id: bookID}).then(() =>{
    incrementBorrowerCount(borrowerID)
    findBookModel(Number(bookID)).borrower_id = Number(borrowerID)
    decrementBorrowerCount(oldBorrowerID)
  })
})


// ADD TWO FUNCTIONS TO INCREMENT AND DECREMENT COUNT OF BOOKS
// WHEN BORROWED

function incrementBorrowerCount(borrowerID) {
  var borrowerRow = $(`.borrower[data-id="${borrowerID}"]`)
  var badgeValue = Number(borrowerRow.find('.badge').text())
  borrowerRow.find('.badge').text(badgeValue + 1)
}

function decrementBorrowerCount(borrowerID) {
  var borrowerRow = $(`.borrower[data-id="${borrowerID}"]`)
  var badgeValue = Number(borrowerRow.find('.badge').text())
  borrowerRow.find('.badge').text(badgeValue - 1)
}


// ADD IMAGE PREVIEW TO 'ADD BOOK' MODAL
$('.addBookImageURL').on('input', (event) => {
  var url = $(event.target).val()
  if(url.length > 0) {
    $('.imagePreview').removeClass('hidden')
  } else {
    $('.imagePreview').addClass('hidden')
  }
  $('.imagePreview img').attr('src', url)
})

// ADD A BORROWER DETAIL MODAL TO KNOW WHAT BOOKS ARE LOANED
$('.borrower').on('click', (event) => {
  var borrowerID = $(event.currentTarget).attr('data-id')
  console.log(borrowerID + ' =borrower ID')
  var borrowerName = $(event.currentTarget).find('.borrowerName').text()
  console.log(borrowerName + ' =borrower name')
  var viewBorrowerModal = $('#viewBorrowerModal')
  viewBorrowerModal.find('#viewBorrowerModalLabel').text(borrowerName)
  viewBorrowerModal.find('.borrowedBooks').text('')
  dataModel.books.forEach((book) => {
    if(book.borrower_id === Number(borrowerID)) {
      viewBorrowerModal.find('.borrowedBooks').append('<li>' + book.title + '</li>')
    }
  })

  viewBorrowerModal.modal('show')

})

// ADD A BOOK DETAIL MODAL TO PROVIDE INFORMATION ABOUT THE BOOK


// $('.book').on('click', (event) => {
//   var bookID = $(event.currentTarget).attr('data-id')
//   var bookTitle = $(event.currentTarget).find('.bookTitles').text()
//   var bookImage = $(event.currentTarget).find('.bookImage').attr('src')
//   var viewBookModal = $('#viewBookModal')
//
//   viewBookModal.find('#viewBookModalLabel').text(bookTitle)
//   // viewBookModal.find('.bookData').text('')
//   viewBookModal.find('.bookData img').attr('src',bookImage)
//
//
//   viewBookModal.modal('show')
//
// })

// SEARCH BOX FEATURE
$('.searchBox input').on('input', (event) => {
  var searchString = $(event.target).val().toLowerCase()

  dataModel.books.forEach((book) => {
    var bookRow = $(`.book[data-id="${book.id}"]`)
    if(book.title.toLowerCase().includes(searchString) || book.description.toLowerCase().includes(searchString)) {
      bookRow.removeClass('hidden')
    } else {
      bookRow.addClass('hidden')
    }
  })
})
