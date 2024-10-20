const mongoose = require('mongoose')

const SessionSchema = new mongoose.Schema({
    no_of_participants:{
        type: Number
    },
    no_of_rounds:{
        type:Number
    },
    no_of_active_participants:{
        type:Number
    },
    condition:{
        type:String
    },
    link:{
        type:String
    }
})

module.exports = mongoose.model("Session",SessionSchema)