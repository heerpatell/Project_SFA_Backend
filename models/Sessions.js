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
},{ timestamps: true })
SessionSchema.methods.getCreatedAtEDT = function() {
    return this.createdAt.toLocaleString("en-US", { timeZone: "America/New_York" })
}

SessionSchema.methods.getUpdatedAtEDT = function() {
    return this.updatedAt.toLocaleString("en-US", { timeZone: "America/New_York" })
}
module.exports = mongoose.model("Session",SessionSchema)