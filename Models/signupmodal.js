const mangoose = require('mongoose');
const userSchema = new mangoose.Schema({
    firstname: String,
    email: String,
    phone: String,
    password: String
})
module.exports = mangoose.model("User", userSchema)