/*  global Requests  */

var bookTemplate = $('#templates .book')
var bookTable = $('#bookTable')

var borrowerTemplate = $('#templates .borrower')
var borrowerTable = $('#borrowerTable')

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

//bookData argument is passed in from the API
function addBookToPage(bookData) {
  //using JQuery, clone the book template from index.html
  var book = bookTemplate.clone()
  //update the book id from the template with a new book id from the API
  book.attr('data-id', bookData.id)
  //update the book title from the template with the book title from the API
  book.find('.bookTitles').text(bookData.title)
  //set the image url for the book from the API
  book.find('.bookImage').attr('src', bookData.image_url)
  //set the image alt to the book title from the API
  book.find('.bookImage').attr('alt', bookData.title)
  //add this data to the table
  bookTable.prepend(book)
}


// =============================================================================
//**************CREATE A FUNCTION TO ADD A BORROWER TO THE PAGE*****************
// =============================================================================

//borrowerData argument is passed in from the API
function addBorrowerToPage(borrowerData) {
  //using JQuery, clone the book template from index.html
  var borrower = borrowerTemplate.clone()
  //update the book id from the template with a new book id from the API
  borrower.attr('data-id', borrowerData.id)
  //update the book title from the template with the book title from the API
  borrower.find('.borrowerName').text(borrowerData.firstname + " " + borrowerData.lastname)
  //add this data to the table
  borrowerTable.prepend(borrower)
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
bookTable.on('click', 'td.btn-sm.btn-danger', function(event) {
  var book = $(event.target).parent()
  var book_id = book.attr('data-id')


  requests.deleteBook({id: book_id}).then(() =>{
    book.remove()
  })
})

// Delete borrower when you click the "X"
borrowerTable.on('click', 'td.btn-sm.btn-danger', function(event) {
  var borrower = $(event.target).parent()
  var borrower_id = borrower.attr('data-id')

  requests.deleteBorrower({id: borrower_id}).then(() => {
    borrower.remove()
  })
})
