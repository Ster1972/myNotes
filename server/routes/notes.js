const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');

function checkAuthenticated  (req, res, next) {
    if (req.isAuthenticated()) {
        return next();

   }
   res.redirect('/login')
  }
  
  function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return res.redirect('/indexAuth')
    }
    next()
  }

/**
 *  App Routes 
*/
router.get('/', mainController.homepage);
router.get('/about', mainController.about);
router.get('/add', mainController.addNote);
router.post('/add', mainController.postNote);
router.get('/view/:id', mainController.view);
router.get('/edit/:id', mainController.edit);
router.put('/edit/:id', mainController.editPost);
router.delete('/edit/:id', mainController.deleteNote);

router.post('/search', mainController.searchNotes);

// Routes that require authentication

router.get('/login',  checkNotAuthenticated, mainController.login)
router.post('/login', checkNotAuthenticated, mainController.postlogin)
router.get('/indexAuth', checkAuthenticated, mainController.indexAuth)



module.exports = router;