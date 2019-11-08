var express= require('express');
var router= express.Router();
var Complaint = require('../../model/complaint');
var passport = require('passport');
var LocalStrategy= require('passport-local').Strategy;

function ensureAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        res.locals.success=req.flash('success');
        res.locals.error=req.flash('error');
        return next();
    }
    
}

router.get('/',ensureAuthenticated,function(req,res){

    res.render('newComplaint',{
        title:'New Complaint'
    })
    
});
router.post('/', ensureAuthenticated,function(req,res){
    var sess=req.user;

    var complaint =req.body.complaint;
    req.checkBody("complaint", "Matric No field is required").notEmpty();
    var errors = req.validationErrors();

    if (errors) {
        res.render('newComplaint',{
            errors:errors,
            complaint:complaint
        });
  
    }
    
    var newComplaint =new Complaint({
        complaint:complaint,
        matric_no:sess.matric_no,
    });
    newComplaint.save(function(err){
        if (err){
            console.log(err);
        }
        req.flash('success', 'You complaint is sent successfully');
        res.redirect('/complaint/history');
    });
    

});

router.get('/history',ensureAuthenticated,function(req,res){
    
    Complaint.find({matric_no:req.user.matric_no}).exec(function(err,complaint){
        res.render('complaintHistory',{
            complaints:complaint,
            title:'Compalaint History'
        });
    });
});

module.exports=router;