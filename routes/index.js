var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect('/index2');
});

// Dashboard page (index2) ahora es pública
router.get('/index2', function(req, res, next) {
    res.render('index2', { 
        title: 'Panel de Control',
        user: req.session ? req.session.user : null
    });
});

// Panel route redirects to index2
router.get('/panel', function(req, res, next) {
    res.redirect('/index2');
});

module.exports = router;
