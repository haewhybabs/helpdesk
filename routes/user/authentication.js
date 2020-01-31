var express= require('express');
var router= express.Router();
var User = require('../../model/users');
var passport = require('passport');
var LocalStrategy= require('passport-local').Strategy;
var bcrypt= require('bcryptjs');

function notAuthenticated(req,res,next){
    if(!req.isAuthenticated()){
        return next();
    }
    
}


router.get('/',notAuthenticated,function(req,res){
    
    res.render('userLogin',{
        title:'Login'
    });
});

router.get('/register',function(req,res){

    res.render('userRegister',{
        title:'Register',
    });
});

router.post('/register', function(req,res){

    var username = req.body.username;
    var email = req.body.email;
    var matric_no=req.body.matric_no;
    var password = req.body.password;
    var password2 = req.body.password2;
  
    //Form Validation
    req.checkBody("matric_no", "Matric No field is required").notEmpty();
    
    req.checkBody("email", "Email field is not valid").isEmail();
    req.checkBody("username", "Username field is required").notEmpty();
    req.checkBody("matric_no", "Matric No field is required").notEmpty();
    req.checkBody("password", "Password field is required").notEmpty();
    req.checkBody("password2", "Password do not match").equals(req.body.password);

    var errors = req.validationErrors();
    if (errors) {
        res.render('userRegister',{
            errors:errors,
            username:username,
            email:email,
            matric_no:matric_no,
            password:password,
            password2:password2
        });
  
    }
    else {
        var newUser =new User({
            matric_no: matric_no,
            email: email,
            username: username,
            password: password,
            roleID:1,
        });
        User.findOne({matric_no:newUser.matric_no})
        .then((existingUser)=>{
            if(existingUser){
                
                req.flash('error', 'Student has already registered');
                res.redirect('/register')
            }
            else{
                User.createUser(newUser, function(err,user){
                    if(err) throw err;
                });
                req.flash('success', 'You have registered successfully');
                res.redirect('/');
            }
        })
        
    }
   
});

router.post('/login', passport.authenticate('student-rule',{failureRedirect:'/', failureFlash: 'Wrong Matric or Password',session:true}),function(req,res){
  
    res.redirect('/dashboard');
});

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
});
  
passport.use('student-rule',new LocalStrategy(
    {
      usernameField: 'matric_no',
      passwordField: 'password'
    },
    function(matric_no, password, done) {
        User.findOne({ matric_no:matric_no }, function(err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Invalid Email' });
            }
            bcrypt.compare(password, user.password, function(err, isMatch) {
                if (err) { return done(err); }
                if(isMatch){
                    return done(null, user);
                } else{
        
                    return done(null, false, {message:'Invalid Password'});
                }
            });
        });
    }
));

router.get('/logout', function(req,res){
    req.logout();
    req.flash('success', 'You are now Logged Out');
    res.redirect('/');
});

//Exports
module.exports=router;