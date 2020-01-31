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


module.exports = router;