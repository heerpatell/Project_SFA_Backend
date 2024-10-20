const mongoose = require('mongoose');
const { Schema } = mongoose;

const matchSchema = new Schema({
  sessionId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Session' 
  },
  matches: {
    type: Map,
    of: [{
      worker: { type: Number},
      customer: { type: Number },
      pretip:{type:Number},
      // posttip:{type:Number},
      effort:{type:Number},
      customerSet:{type:Number},
      totalCompWorker:{type:Number},
      totalCompCustomer:{type:Number}
    }]
  }
});

module.exports = mongoose.model('Match', matchSchema);
