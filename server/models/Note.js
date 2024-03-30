const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const NoteSchema = new Schema({
  title: { type: String },
  category: { type: String},
  linkurl: { type: String },
  comment: { type: String },
  createdAt: { type: Date,  default: Date.now() },
  updatedAt: { type: Date,  default: Date.now() }
});

const UserSchema = new Schema({
  name: { type: String},
  email: { type: String},
  password: { type: String}
})

module.exports = {
  Note: mongoose.model('Note', NoteSchema, 'notes'),
  User: mongoose.model('User', UserSchema, 'users' )

}