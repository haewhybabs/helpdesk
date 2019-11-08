var mongoose = require ('mongoose');
var keys=require('../config/key');
mongoose.connect(keys.mongoURI);
var db = mongoose.connection;

var ComplaintSchema= mongoose.Schema({
    matric_no: {
        type: String,
        required:true

    },
    complaint:{
        type: String,
        required:true
    },
    response:{
        type:String,
        required:false


    },
    created_date:{
        type : Date, 
        default: Date.now
    },
    modify_date:{
        type:Date,
        required:false
    },

    status:{
        type:String,
        required:false
    }
});
var User = module.exports = mongoose.model('Complaint', ComplaintSchema,'complaint');
