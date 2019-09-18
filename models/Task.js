var mongoose = require('mongoose'); //Import the mongoose libraries
//reference to the schema
var taskSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name:{
        type: String,
        required: true
    },
    assign_To:{
        type: String,
        required: true
    },
    due_Date:{
        type: Date,
        required: true
    },
    status:{
        type:String,
        validate:{//This is a validator to ensure that tasks can only have a status of InProgress or Complete as written in the same was as the developer level (EXPERT or BEGINNER)
            validator:function(statusValue){
                return statusValue === 'InProgress' || statusValue === 'Complete'
            },
            message: 'Its either InProgress or Complete'
        }
    },
    description:{
        type: String,
        required: true
    },
    creadted:{
        type:Date,
        default: Date.now,
        required: true
    }
});
module.exports = mongoose.model('Task', taskSchema);//The 'Task shows what this document should be referred to as when referencing this schema on other pages.'