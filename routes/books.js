const express = require('express');
const router = express.Router();
const dbConn = require('../lib/db');

// List all books (showing active ones by default)
router.get('/', (req, res) => {
  dbConn.query('SELECT * FROM books', (err, data) => {
    if (err) throw err;
    res.render('books/index', { books: data });
  });
});

// Display add book form
router.get('/add', function(req, res, next) {
    const queryAuthors = 'SELECT * FROM authors ORDER BY id_author DESC';
    const queryCategories = 'SELECT * FROM categories ORDER BY id_category DESC';
    const queryEditorials = 'SELECT * FROM editorials ORDER BY id_editorial DESC';

    dbConn.query(queryAuthors, function(err, authors) {
        if (err) {
            req.flash('error', 'Error al cargar autores');
            return res.render('books/add', {
                authors: [],
                categories: [],
                editorials: [],
                title: '',
                isbn: '',
                year: '',
                currentYear: new Date().getFullYear(),
                messages: req.flash()
            });
        }

        dbConn.query(queryCategories, function(err, categories) {
            if (err) {
                req.flash('error', 'Error al cargar categorías');
                return res.render('books/add', {
                    authors,
                    categories: [],
                    editorials: [],
                    title: '',
                    isbn: '',
                    year: '',
                    currentYear: new Date().getFullYear(),
                    messages: req.flash()
                });
            }

            dbConn.query(queryEditorials, function(err, editorials) {
                if (err) {
                    req.flash('error', 'Error al cargar editoriales');
                    return res.render('books/add', {
                        authors,
                        categories,
                        editorials: [],
                        title: '',
                        isbn: '',
                        year: '',
                        currentYear: new Date().getFullYear(),
                        messages: req.flash()
                    });
                }

                res.render('books/add', {
                    authors,
                    categories,
                    editorials,
                    title: '',
                    isbn: '',
                    year: '',
                    currentYear: new Date().getFullYear(),
                    messages: req.flash()
                });
            });
        });
    });
});

// Add new book
router.post('/add', function(req, res, next) {
    let title = req.body.title;
    let isbn = req.body.isbn;
    let year = req.body.year;
    let id_author = req.body.author;
    let id_category = req.body.category;
    let id_editorial = req.body.editorial;
    let available_copies = req.body.available_copies || 1;

    let errors = false;

    if(!title || !isbn || !year || !id_author || !id_category || !id_editorial) {
        errors = true;
        req.flash('error', 'Por favor ingrese todos los campos requeridos');
        res.redirect('/books/add');
        return;
    }

    let form_data = {
        title: title,
        isbn: isbn,
        year: year,
        id_author: id_author,
        id_category: id_category,
        id_editorial: id_editorial,
        available_copies: available_copies,
        state: 1
    };

    dbConn.query('INSERT INTO books SET ?', form_data, function(err, result) {
        if (err) {
            req.flash('error', err.message);
            res.redirect('/books/add');
        } else {
            req.flash('success', 'Libro agregado correctamente');
            res.redirect('/books');
        }
    });
});

// Display edit book form
router.get('/edit/:id', function(req, res, next) {
    let id = req.params.id;

    dbConn.query('SELECT * FROM books WHERE id_book = ?', [id], function(err, rows) {
        if(err) {
            req.flash('error', err.message);
            res.redirect('/books');
        } else if (!rows || rows.length === 0) {
            req.flash('error', 'Libro no encontrado');
            res.redirect('/books');
        } else {
            dbConn.query('SELECT * FROM authors ORDER BY id_author DESC', function(err, authors) {
                if (err) {
                    req.flash('error', err.message);
                    res.redirect('/books');
                } else {
                    dbConn.query('SELECT * FROM categories ORDER BY id_category DESC', function(err, categories) {
                        if (err) {
                            req.flash('error', err.message);
                            res.redirect('/books');
                        } else {
                            dbConn.query('SELECT * FROM editorials ORDER BY id_editorial DESC', function(err, editorials) {
                                if (err) {
                                    req.flash('error', err.message);
                                    res.redirect('/books');
                                } else {
                                    res.render('books/edit', {
                                        id: rows[0].id_book,
                                        title: rows[0].title,
                                        isbn: rows[0].isbn,
                                        year: rows[0].year,
                                        available_copies: rows[0].available_copies,
                                        authors: authors,
                                        categories: categories,
                                        editorials: editorials,
                                        currentAuthor: rows[0].id_author,
                                        currentCategory: rows[0].id_category,
                                        currentEditorial: rows[0].id_editorial,
                                        currentYear: new Date().getFullYear(),
                                        state: rows[0].state
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

// Update book
router.post('/update/:id', function(req, res, next) {
    let id = req.params.id;
    let title = req.body.title;
    let isbn = req.body.isbn;
    let year = req.body.year;
    let id_author = req.body.author;
    let id_category = req.body.category;
    let id_editorial = req.body.editorial;
    let state = req.body.state;
    let available_copies = req.body.available_copies;

    let errors = false;

    if(!title || !isbn || !year || !id_author || !id_category || !id_editorial) {
        errors = true;
        req.flash('error', 'Por favor ingrese todos los campos requeridos');
        res.redirect('/books/edit/' + id);
        return;
    }

    let form_data = {
        title: title,
        isbn: isbn,
        year: year,
        id_author: id_author,
        id_category: id_category,
        id_editorial: id_editorial,
        available_copies: available_copies,
        state: state || 1
    };

    dbConn.query('UPDATE books SET ? WHERE id_book = ?', [form_data, id], function(err, result) {
        if (err) {
            req.flash('error', err.message);
            res.redirect('/books/edit/' + id);
        } else {
            req.flash('success', 'Libro actualizado correctamente');
            res.redirect('/books');
        }
    });
});

// Move book to trash (toggle state)
router.get('/toggle-state/:id', function(req, res, next) {
    let id = req.params.id;
    
    dbConn.query('UPDATE books SET state = NOT state WHERE id_book = ?', [id], function(err, result) {
        if (err) {
            req.flash('error', err.message);
        } else {
            req.flash('success', 'Estado del libro actualizado correctamente');
        }
        res.redirect('/books');
    });
});

// View books in trash
router.get('/inactive', function(req, res, next) {
    dbConn.query('SELECT books.*, authors.name as author_name, categories.name as category_name, editorials.name as editorial_name FROM books LEFT JOIN authors ON books.id_author = authors.id_author LEFT JOIN categories ON books.id_category = categories.id_category LEFT JOIN editorials ON books.id_editorial = editorials.id_editorial WHERE books.state = 0 ORDER BY books.id_book DESC', function(err, rows) {
        if(err) {
            req.flash('error', err.message);
            res.render('books/deleted', { data: [] });
        } else {
            res.render('books/deleted', { data: rows });
        }
    });
});

// Permanently delete book
router.get('/delete/:id', function(req, res, next) {
    let id = req.params.id;
    
    dbConn.query('DELETE FROM books WHERE id_book = ?', [id], function(err, result) {
        if (err) {
            req.flash('error', err.message);
        } else {
            req.flash('success', 'Libro eliminado permanentemente');
        }
        res.redirect('/books/inactive');
    });
});

module.exports = router;
