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

// Info on export above
// The first parameter is the name of the model, which is 'Note'.
// The second parameter is the schema for the model, which is presumably defined somewhere else in the code and referenced as NoteSchema.
// The third parameter is the name of the MongoDB collection where documents for this model will be stored, which is 'notes' in this case.