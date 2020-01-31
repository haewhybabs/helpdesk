var express= require('express');
var router= express.Router();
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
    res.render('headDashboard',{
        title:'Dasboard'
    })
    
});




module.exports=router;
