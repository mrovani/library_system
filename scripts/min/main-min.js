var bookTemplate = $('#templates .book')
var bookTable = $('#bookTable')

var borrowerTemplate = $('#templates .borrower')
var borrowerTable = $('#borrowerTable')

var libraryID = 129

var baseURL = `https://floating-woodland-64068.herokuapp.com/libraries/${libraryID}`

//******************CREATE A FUNCTION TO ADD A BOOK TO THE PAGE*****************
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


// write ajax GET request to fetch book data from the API
var getBooksRequest = $.ajax ({
  type: 'GET',
  url: `${baseURL}/books`,
})

// after GET request is done, loop through each book and add book data to page
getBooksRequest.done( (dataFromServer) => {
  dataFromServer.forEach( (bookData) => {
    addBookToPage(bookData)
  } )
})

// Add book directly from MODAL
$('#createBookButton').on('click', () => {
  var bookData = {}
  bookData.title = $('.addBookTitle').val()
  bookData.description = $('.addBookDescription').val()
  bookData.image_url = $('.addBookImageURL').val()

  var createBookRequest = $.ajax ({
    type: 'POST',
    url: `${baseURL}/books`,
    data: {
      book: bookData
    }
  })
  createBookRequest.done((dataFromServer) => {
    addBookToPage(dataFromServer)
    $(`#addBookModal`).modal('hide')
    $(`#addBookForm`)[0].reset()
  })
})



// Delete items when you click the "X"
bookTable.on('click', 'td.btn-sm.btn-danger', function(event) {
  var book = $(event.target).parent()
  var book_id = book.attr('data-id')

  var deleteRequest = $.ajax({
    type: 'DELETE',
    url: `${baseURL}/books/` + book_id
  })

  deleteRequest.done(function() {
    book.remove()
  })
})

//**************CREATE A FUNCTION TO ADD A BORROWER TO THE PAGE*****************

//borrowerData argument is passed in from the API
function addBorrowerToPage(borrowerData) {
  //using JQuery, clone the book template from index.html
  var borrower = borrowerTemplate.clone()
  //update the book id from the template with a new book id from the API
  borrower.attr('data-id', borrowerData.id)
  //update the book title from the template with the book title from the API
  borrower.find('.firstName').text(borrowerData.firstname)
  //set the image url for the book from the API
  borrower.find('.lastName').text(borrowerData.lastname)
  //add this data to the table
  borrowerTable.prepend(borrower)
}



// write ajax GET request to fetch borrower data from the API
var getBorrowersRequest = $.ajax ({
  type: 'GET',
  url: `${baseURL}/borrowers`,
})

// after GET request is done, loop through each borrower and add borrower data to page
getBorrowersRequest.done( (dataFromServer) => {
  dataFromServer.forEach( (borrowerData) => {
    addBorrowerToPage(borrowerData)
  } )
})

// Delete borrower when you click the "X"
borrowerTable.on('click', 'td.btn-sm.btn-danger', function(event) {
  var borrower = $(event.target).parent()
  var borrower_id = borrower.attr('data-id')

  var deleteRequest = $.ajax({
    type: 'DELETE',
    url: `${baseURL}/borrowers/` + borrower_id
  })

  deleteRequest.done(function() {
    borrower.remove()
  })
})


