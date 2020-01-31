var express = require('express');
var router = express.Router();
var User = require('../../model/users');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');

function notAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }

}

router.get('/', notAuthenticated, function(req, res) {

    res.render('headLogin', {
        title: 'Login'
    });
});

router.post('/', passport.authenticate('admin-rule', { failureRedirect: '/head-auth', failureFlash: 'Invalid Username or Password', session: true }), function(req, res) {

    if (req.user.roleID == 2 || req.user.roleID == 3) {

        res.redirect('/head-dashboard');
    }


});

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use('admin-rule', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(email, password, done) {
        User.findOne({ email: email }, function(err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Invalid Email' });
            }
            bcrypt.compare(password, user.password, function(err, isMatch) {
                if (err) { return done(err); }
                if (isMatch) {
                    return done(null, user);
                } else {

                    return done(null, false, { message: 'Invalid Password' });
                }
            });
        });
    }
));


module.exports = router;