const express = require('express');
const router = express.Router();
const Book = require('../models').Book;


//Handler function to wrap each route.
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      res.status(500).send(error);
    }
  }
}


//get /books - Shows the full list of books.
router.get('/', asyncHandler(async (req, res, next) => {
  const books = await Book.findAll({ order: [['title']] });
  console.log(books.map(book => book.toJSON()));
  res.render('index',{books: books});
  }));


//get /books/new - Shows the create new book form.
router.get('/new', (req, res, next) => {
	res.render('new_book');
});

//post /books/new - Posts a new book to the database. 
router.post('/new', asyncHandler(async(req, res, next) => {
    let book;
  try {
    book = await Book.create(req.body);
    console.dir(req.body);
    res.redirect('/books');
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      book = await Book.build(req.body);
      const bookData = {book: book, errors: error.errors};
      res.render('new_book', bookData);
    } else {
      throw error;
    }
  } 
}));


//get /books/:id - Shows book detail form.
router.get('/:id', asyncHandler(async(req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if(book){
      res.render('update-book', {book: book});
    } else {
      const err = new Error('Sorry, book not found');
      err.status = 404;
      next(err);
    }
  } catch (error) {
    res.status(404).render('page_not_found');
  }
}));

//post /books/:id - Updates book info in the database.
router.post('/:id', asyncHandler(async(req, res, next) => {
    let book;
  try{
    book = await Book.findByPk(req.params.id);
    if(book){
      await book.update(req.body);
      res.redirect('/books');
    } else {
      res.status(404).render('error');
    }
    
  } catch (error){
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      const bookData = {book: book, errors: error.errors};
      res.render('update-book', bookData);
    } else {
      throw error;
    }
  }
}));


//post /books/:id/delete - Deletes a book. Careful, this can’t be undone. It can be helpful to create a new “test” book to test deleting.
router.post('/:id/delete', asyncHandler(async(req, res, next) => {
  try{
    const book = await Book.findByPk(req.params.id);
    if(book){
      await book.destroy();
      res.redirect('/books');
    } else {
      res.status(404).render('page_not_found');
    }
  } catch (error){
    res.status(404).render('page_not_found');
  }
}));

module.exports = router;

