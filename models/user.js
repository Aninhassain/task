const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/taskuser');
const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    image: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
module.exports = mongoose.model('User', userSchema);
