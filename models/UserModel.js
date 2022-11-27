const mongoose = require('mongoose')
const {Schema} = mongoose

let UserSchema = new Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    rol: {type: Number, default: 2},
    creationDate: {type: Date, default: Date.now}
})

module.exports = mongoose.model('User',UserSchema,'Users')