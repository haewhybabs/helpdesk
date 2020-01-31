var express= require('express');
var router= express.Router();
var Complaint = require('../../model/complaint');
var User = require('../../model/users');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

function ensureAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        if(req.user.roleID==1){
            req.logout();
            res.redirect('/');
        }
        res.locals.success=req.flash('success');
        res.locals.error=req.flash('error');
        return next();
    }   
    
    req.flash('error','Opps!! There is a problem with the authentication');

    res.redirect('/head-auth');
}

router.get('/',ensureAuthenticated,function(req,res){
    Complaint.find().exec(function(err,complaint){
        res.render('studentComplaints',{
            title:'Student complaints',
            complaints:complaint
        });
    });
    
    
});

router.get('/user-details/:id',ensureAuthenticated, function(req,res){
    var id = req.params.id;

    User.findOne({_id:id}).exec(function(err,user){
        res.render('studentDetails',{
            title:'Student Details',
            userdetails:user
        });
        
    });


});

router.get('/response/:id', ensureAuthenticated, function(req,res){
    var id= req.params.id;
    Complaint.findById(id, function(err,complaint){
        res.render('headResponse',{
            title:'Head Response',
            complaint:complaint,
            id:id
        });
    });
});

router.post('/reply',ensureAuthenticated, function(req,res){
    var response =req.body.response;
    req.checkBody("response", "Response field is required").notEmpty();
    var errors = req.validationErrors();

    if (errors) {

        res.render('studentComplaint',{
            errors:errors,
            response:response
        });
  
    }

    var complaint_id=req.body.complaint_id;
    var datetime = new Date();

    var update={
        response:response,
        modify_date:datetime,
    };

    Complaint.findByIdAndUpdate(complaint_id, update,function(err, complaint){

        req.flash('success', 'Thanks for your response');
        res.redirect('/student-complaints');
    });



});

router.get('/approve/:id', ensureAuthenticated, function(req,res){
    var id= req.params.id;
    var update={
        status:"success"
    };
    Complaint.findByIdAndUpdate(id, update,function(err, complaint){

        req.flash('success', 'Work approved successfully');
        res.redirect('/student-complaints');
    });
});






module.exports=router;
