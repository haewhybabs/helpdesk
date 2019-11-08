var express= require('express');
var router= express.Router();
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

function ensureAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        res.locals.success=req.flash('success');
        res.locals.error=req.flash('error');
        return next();
    }
    
    req.flash('error','Opps!! There is a problem with the authentication');

    res.redirect('/');
}

router.get('/',ensureAuthenticated,function(req,res){
    console.log(res.locals);
    res.render('userDashboard',{
        title:'Dasboard'
    })
    
});




//Exports
module.exports=router;