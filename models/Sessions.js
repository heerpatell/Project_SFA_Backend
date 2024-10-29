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

SessionSchema.pre('save', function(next) {
    const edtDate = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
    const edtOffset = new Date(edtDate).getTime() - new Date().getTime();

    if (this.isNew) {
        this.createdAt = new Date(this.createdAt.getTime() + edtOffset);
    }
    this.updatedAt = new Date(this.updatedAt.getTime() + edtOffset);
    next();
});


module.exports = mongoose.model("Session",SessionSchema)