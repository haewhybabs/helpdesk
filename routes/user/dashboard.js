var express= require('express');
var router= express.Router();
var Knowledgebase = require('../../model/knowledgebase');
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
    // console.log(res.locals);
    res.render('userDashboard',{
        title:'Dasboard'
    })
    
});

router.get('/knowledgebase',ensureAuthenticated,function(req,res){
    Knowledgebase.find().exec(function(err,knowledge){
        res.render('userKnowledgebase',{
            title:'Knowledge',
            knowledgebases:knowledge
        });
    });
    
});




//Exports
module.exports=router;