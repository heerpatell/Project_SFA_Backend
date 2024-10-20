const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  participantId: { type: String, required: true, unique: true },
  socketId: { type: String, required: true },
});

const ParticipantSocket = mongoose.model('ParticipantSocket', participantSchema);

module.exports = ParticipantSocket;
