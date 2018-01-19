class Requests {

  constructor(libraryID) {
    this.serverURL = "https://floating-woodland-64068.herokuapp.com"
    // this.serverURL = "http://localhost:3000"
    this.libraryID = libraryID
  }


  /*
    POST -> /libraries
    Create a new library with the given name
  */
  createLibrary(name) {
    var promise = new Promise((resolve) => {
      var req = $.ajax({
        type: 'POST',
        url: `${this.serverURL}/libraries`,
        data: {
          library: {
            name: name,
          }
        }
      })
      req.done((data) => {
        this.libraryID = data.id
        resolve(data)
      })
    })
    return promise
  }


  /*
  ==================================================================
    BORROWERS
  ==================================================================
  */

  getBorrowers() {
    var promise = new Promise((resolve) => {
      var req = $.ajax({
        type: 'GET',
        url: `${this.serverURL}/libraries/${this.libraryID}/borrowers`
      })
      req.done((data) => {
        resolve(data)
      })
    })
    return promise
  }


  /*
    POST -> /libraries/:library_id/borrowers
    Create a new borrower with the given arguments
  */
  createBorrower(borrower) {
    var promise = new Promise((resolve) => {
      var req = $.ajax({
        type: 'POST',
        url: `${this.serverURL}/libraries/${this.libraryID}/borrowers`,
        data: {
          borrower: borrower
        }
      })
      req.done((data) => {
        resolve(data)
      })
    })
    return promise
  }


  updateBorrower(borrower) {
    var promise = new Promise((resolve) => {
      var req = $.ajax({
        type: 'PUT',
        url: `${this.serverURL}/libraries/${this.libraryID}/borrowers/${borrower.id}`,
        data: {
          borrower: borrower
        }
      })
      req.done((data) => {
        resolve(data)
      })
    })
    return promise
  }


  deleteBorrower(borrower) {
    var promise = new Promise((resolve) => {
      var req = $.ajax({
        type: 'DELETE',
        url: `${this.serverURL}/libraries/${this.libraryID}/borrowers/${borrower.id}`,
      })
      req.done((data) => {
        resolve(data)
      })
    })
    return promise
  }


  /*
  ==================================================================
    BOOKS
  ==================================================================
  */

  getBooks() {
    var promise = new Promise((resolve) => {
      var req = $.ajax({
        type: 'GET',
        url: `${this.serverURL}/libraries/${this.libraryID}/books`
      })
      req.done((data) => {
        resolve(data)
      })
    })
    return promise
  }

  /*
    POST -> /libraries/:library_id/books
    Create a new book with the given arguments
  */
  createBook(book) {
    var promise = new Promise((resolve) => {
      var req = $.ajax({
        type: 'POST',
        url: `${this.serverURL}/libraries/${this.libraryID}/books`,
        data: {
          book: book
        }
      })
      req.done((data) => {
        resolve(data)
      })
    })
    return promise
  }

  updateBook(book) {
    var promise = new Promise((resolve) => {
      var req = $.ajax({
        type: 'PUT',
        url: `${this.serverURL}/libraries/${this.libraryID}/books/${book.id}`,
        data: {
          book: book
        }
      })
      req.done((data) => {
        resolve(data)
      })
    })
    return promise
  }


  deleteBook(book) {
    var promise = new Promise((resolve) => {
      var req = $.ajax({
        type: 'DELETE',
        url: `${this.serverURL}/libraries/${this.libraryID}/books/${book.id}`,
      })
      req.done((data) => {
        resolve(data)
      })
    })
    return promise
  }

}
