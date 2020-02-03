var express = require('express');
var router = express.Router();
var Complaint = require('../../model/complaint');
var User = require('../../model/users');
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.roleID == 1) {
            req.logout();
            res.redirect('/');
        }
        res.locals.success = req.flash('success');
        res.locals.error = req.flash('error');
        return next();
    }

    req.flash('error', 'Opps!! There is a problem with the authentication');

    res.redirect('/head-auth');
}

router.get('/', ensureAuthenticated, function(req, res) {


    User.find({ roleID: 2 }).exec(function(err, users) {
        res.render('fhead', {
            title: 'Facility Head List',
            users: users
        });

    });


});

router.post('/register', function(req, res) {

    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;


    //Form Validation


    req.checkBody("email", "Email field is not valid").isEmail();
    req.checkBody("username", "Username field is required").notEmpty();
    req.checkBody("password", "Password field is required").notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        res.render('fhead', {
            errors: errors,
            username: username,
            email: email,
            password: password,

        });

    } else {
        var newUser = new User({
            email: email,
            username: username,
            password: password,
            roleID: 2,
        });
        User.findOne({ email: newUser.email })
            .then((existingUser) => {
                if (existingUser) {

                    req.flash('error', 'Facility Head is already registered');
                    res.redirect('/facility-head')
                } else {
                    User.createUser(newUser, function(err, user) {
                        if (err) throw err;
                    });
                    req.flash('success', 'You have created a new facility head');
                    res.redirect('/facility-head');
                }
            })

    }

});


module.exports = router;