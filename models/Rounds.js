const mongoose = require('mongoose');

const RoundSchema = new mongoose.Schema({
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    no_of_rounds: {
        type: Number
    },
    participants_reached_screen11: {
        type: Number
    },
    current_round: {
        type: Number,
        default:0
    },
    round_details: {
        type: Map,
        of: new mongoose.Schema({
            status: {
                type: String,
                default: 'inactive'
            }
        }),
        default: {}
    }
});

module.exports = mongoose.model('Round', RoundSchema);
