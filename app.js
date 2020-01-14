//Using express
const express = require('express');
const path = require('path');
const Book = require('./models').Book;
const indexRoute = require('./routes/index');
const booksRoute = require('./routes/books');

const app = express();

//Setting static files. Static files in the public folder.
app.use(express.static(path.join(__dirname, 'public')));

//Using express.json based on body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Setting the template engine to pug
app.set('view engine', 'pug');

//Setting Routes
app.use('/', indexRoute);
app.use('/books', booksRoute);

//Importing database and sync all the tables. 
(async() => {
	await Book.sequelize.sync();
});


//Erros:
app.use((req, res, next) => {
	const error = new Error('Page Not Found');
	error.status = 404;
	next(error); //Calling to middleware error handling function
});

//Error handling middelware
app.use((err, req, res, next) => {
	res.locals.error = err;
	console.dir(err);
	res.status(err.status);
	if (err.status === 404) {
		res.render('error'); 
	} else {
		res.render('page-not-found');
	}		
});


app.listen(3000, () => {
	console.log('The application is running on localhost:3000');
});
