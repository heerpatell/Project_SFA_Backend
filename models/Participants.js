const mongoose = require('mongoose')

const ParticipantSchema = new mongoose.Schema({
    sessionId:{
        type: mongoose.Schema.Types.ObjectId,
    },
    participants:[{
        participant_number:{
            type: Number
        },
        assigned_category:{
            type:String
        },
        gender:{
            type:String
        },
        age:{
            type:Number
        },
        workexperience:{
            type:Number
        },
        foodindustry:{
            type:Number
        }
    }]
})

module.exports = mongoose.model("Participant",ParticipantSchema)