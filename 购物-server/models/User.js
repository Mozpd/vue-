const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    pwd: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    },
});
const User = mongoose.model("User", userSchema);
module.exports = User;

