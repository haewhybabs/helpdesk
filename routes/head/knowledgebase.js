var express= require('express');
var router= express.Router();
var Knowledgebase = require('../../model/knowledgebase');
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
    res.render('knowledgebase',{
        title:'Knowledgebase'
    })
    
});
router.post('/',ensureAuthenticated, function(req,res){
    var knowledge =req.body.knowledge;
    var solution=req.body.solution;
    req.checkBody("knowledge", "Knowledge Base field is required").notEmpty();
    req.checkBody("solution","Solution field is required").notEmpty();
    var errors = req.validationErrors();

    if (errors) {

        res.render('knowledgebase',{
            errors:errors,
            knowledge:knowledge,
            solution:solution
        });
  
    }

    var newKnowledge =new Knowledgebase({
       knowledge:knowledge,
       solution:solution,
       uploaded_by:req.user._id,
    });
    newKnowledge.save(function(err){
        if (err){
            console.log(err);
        }
        req.flash('success', 'Knowledge is successfully added');
        res.redirect('/knowledgebase/view');
    });





});

router.get('/view',ensureAuthenticated,function(req,res){
    Knowledgebase.find().exec(function(err,knowledge){
        res.render('ViewKnowledgebase',{
            title:'Knowledge',
            knowledgebases:knowledge
        });
    });
    
});


module.exports=router;