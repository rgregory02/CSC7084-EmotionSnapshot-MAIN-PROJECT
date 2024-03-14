const express = require('express');
const controller = require('./../controllers/mycontrollers');
//const conn = require('../utils/dbconn');
const router = express.Router();
const { isAuth } = require('./../middleware/auth');
const { isLoggedIn } = require('./../middleware/loggedin');
const { check, validationResult } = require('express-validator');

router.get('/signup', isLoggedIn, controller.getSignup);
router.get('/login', isLoggedIn, controller.getLogin);
router.get('/logout', controller.getLogout);
router.get('/userdetails', isAuth, controller.selectUserDetails);

router.get('/', controller.getSnapshot);
router.get('/new', isAuth, controller.getAddNewSnapshot);
router.get('/edit/:id', isAuth, controller.selectSnapshot);
router.get('/summarychart', isAuth, controller.getSummaryChart);


router.post('/new', isAuth, controller.postNewSnapshot);
router.post('/edit/:id', isAuth, controller.updateSnapshot);
router.post('/del/:id', isAuth, controller.deleteSnapshot);

router.post('/signup', 
    check('username')
        .exists()
        .isLength({ min: 5 })
        .withMessage('Username must be at least 5 characters!'),
    controller.postSignup);

router.post('/login', 
        check('username')
        .exists()
        .isLength({ min: 5 })
        .withMessage('Username must be at least 5 characters!'),
    controller.postLogin);

router.post('/userdetails', 
        check('username')
            .exists()
            .isLength({ min: 5 })
            .withMessage('Username must be at least 5 characters!'),
    controller.postUpdateDetails);

module.exports = router;