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


    User.find({ roleID: 1 }).exec(function(err, users) {
        res.render('studentList', {
            title: 'Student List',
            users: users
        });

    });


});


router.post('/register', function(req, res) {

    var username = req.body.username;
    var email = req.body.email;
    var matric_no = req.body.matric_no;
    var password = req.body.password;
    var password2 = req.body.password2;

    //Form Validation

    req.checkBody("email", "Email field is not valid").isEmail();
    req.checkBody("username", "Username field is required").notEmpty();
    req.checkBody("matric_no", "Matric No field is required").notEmpty();
    req.checkBody("password", "Password field is required").notEmpty();
    // req.checkBody("password2", "Password do not match").equals(req.body.password);

    var errors = req.validationErrors();
    if (errors) {
        res.render('studentList', {
            errors: errors,
            username: username,
            email: email,
            matric_no: matric_no,
            password: password,
            // password2: password2
        });

    } else {
        var newUser = new User({
            matric_no: matric_no,
            email: email,
            username: username,
            password: password,
            roleID: 1,
        });
        User.findOne({ matric_no: newUser.matric_no })
            .then((existingUser) => {
                if (existingUser) {

                    req.flash('error', 'Student has already registered');
                    res.redirect('/students')
                } else {
                    User.createUser(newUser, function(err, user) {
                        if (err) throw err;
                    });
                    req.flash('success', 'You have registered successfully');
                    res.redirect('/students');
                }
            })

    }

});


module.exports = router;