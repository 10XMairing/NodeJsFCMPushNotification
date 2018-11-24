const mongoose = require('mongoose');


const tokenSchema =  mongoose.Schema({
        _id : mongoose.Schema.Types.ObjectId,
        token: {type : String , unique : true, required : true}
})


module.exports = mongoose.model('Token', tokenSchema);