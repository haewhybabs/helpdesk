var mongoose = require ('mongoose');
var keys=require('../config/key');
mongoose.connect(keys.mongoURI);
var db = mongoose.connection;

var KnowledgebaseSchema= mongoose.Schema({
    uploaded_by: {
        type: String,
        required:true

    },
    knowledge:{
        type: String,
        required:true
    },
    solution:{
        type:String,
        required:true
    },
    created_date:{
        type : Date, 
        default: Date.now
    },
    modify_date:{
        type:Date,
        required:false
    },
});
var User = module.exports = mongoose.model('Knowledgebase', KnowledgebaseSchema,'knowledgebase');
