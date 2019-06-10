import  mongoose from 'mongoose'; 

var Schema = mongoose.Schema;

var userSchema = new Schema({
  username:  String,
  firstname: String,
  lastname: String,
  password: String,
  nic:   String,
  deviceid: String,
  email: String,
  tp: Number,
  location: { type: {
    type: String,
    enum: ['Point'],
    required: true
  }, coordinates: [Number]},
  currentaddr: { district: String, dsdivision: String },
  createdate:{ type: Date, default: Date.now },
  verified: { type: Boolean, default: false },
  blackListed: { type: Boolean, default: false }
});

userSchema.virtual('fullName').get(function () {
    return this.name.firstname + ' ' + this.name.lastname;
});

const User = mongoose.model('User', userSchema);

export default User;