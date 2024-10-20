const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema
const ResponseSchema = new Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  pnumber: {
    type: String
  },
  condition: {
    type: String
  },
  EffortSensitivity_Manager: {
    type: Number,  // Response for question about the Manager's effect on effort
    min: 1,
    max: 7
  },
  EffortSensitivity_Customer: {
    type: Number,  // Response for question about the Customer's effect on effort (Service Charge or Tip)
    min: 1,
    max: 7
  },
  Observability_Manager: {
    type: Number,  // Response for the Manager's observability on effort
    min: 1,
    max: 7
  },
  Observability_Customer: {
    type: Number,  // Response for the Customer's observability on effort
    min: 1,
    max: 7
  },
  MentalAccount: {
    type: Number,  // This question only appears for Service Charge condition, leave null for others
    min: 1,
    max: 7
  },

  // Post-Study Questions for Worker role
  controllability1: {
    type: Number,  // To what extent do you think your total compensation was affected by your effort level?
    min: 1,
    max: 7
  },
  controllability2: {
    type: Number,  // To what extent do you think you could influence your total compensation?
    min: 1,
    max: 7
  },
  
  // Post-Tip and Pre-Tip only questions
  tipReasonEffort: {
    type: Number,  // To what extent do you perceive that the tip was affected by your effort?
    min: 1,
    max: 7
  },
  tipReasonSocialImage: {
    type: Number,  // To what extent do you perceive the tip was affected by social pressure?
    min: 1,
    max: 7
  },
  tipReasonSocialNorm: {
    type: Number,  // To what extent do you perceive the tip was affected by how others usually tip?
    min: 1,
    max: 7
  },
  TipReason_Effort:{
    type:Number,
    min: 1,
    max: 7
  },
  TipReason_SocialImage:{
    type:Number,
    min: 1,
    max: 7
  },
  TipReason_SocialNorm:{
    type:Number,
    min: 1,
    max: 7  
  },
  response:{
    type:String
  },
  amount:{
    type:Number
  }
}, { timestamps: true });  // Automatically add createdAt and updatedAt fields

// Create and export the model
const Response = mongoose.model('Response', ResponseSchema);
module.exports = Response;
