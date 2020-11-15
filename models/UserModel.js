import mongoose from "mongoose";
import { compareSync, genSaltSync, hashSync } from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET_KEY = "some-secret-key";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  followedTopics: {
    type: Array,
    default: [],
    required: false
  }
});

UserSchema.methods.generateHash = password => hashSync(password, genSaltSync(8), null);

UserSchema.methods.validatePassword = function(password) {
  return compareSync(password, this.password);
};

UserSchema.methods.getAuthToken = function() {
  return jwt.sign({
      id: this._id,
      email: this.email,
      username: this.username
    },
    SECRET_KEY,
    { expiresIn: "3h" }
  );
};


UserSchema.query.byEmail = function(email) {
  return this.findOne({ email: email });
};

UserSchema.query.byId = function(id) {
  return this.findOne({ _id: id });
};

// EventSchema.query.inTheFuture = function() {
//   return this.find({
//     $gte: new Date()
//   });
// };

const User = mongoose.model("User", UserSchema);

export default User;
