const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  userPass: {
    type: String,
    required: true
  },
  userStatus: {
    type: String,
    required: true
  },
  userBudget: {
    type: String,
    required: true
  },
  userOwner: {
    type: Boolean,
    required: true
  },
})
userSchema.index({ username: 1 }, { unique: false });

module.exports = mongoose.model('User', userSchema)
