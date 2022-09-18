var mongoose = require("mongoose");

var staking = new mongoose.Schema({
    addr: { type: String, required: true, unique: true },
    stake: [
        {
            tokenId: Number,
            initstamp: Date,
            prevstamp: Date,
            _id: false,
        },
    ],
    point: { type: Number, default: 0 },
});

module.exports = mongoose.models.users || mongoose.model("users", staking);

export {};
