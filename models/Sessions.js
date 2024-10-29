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
SessionSchema.virtual('createdAtEDT').get(function() {
    return this.createdAt ? this.createdAt.toLocaleString("en-US", { timeZone: "America/New_York" }) : null;
});

SessionSchema.virtual('updatedAtEDT').get(function() {
    return this.updatedAt ? this.updatedAt.toLocaleString("en-US", { timeZone: "America/New_York" }) : null;
});

SessionSchema.set('toJSON', { virtuals: true });
SessionSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model("Session",SessionSchema)