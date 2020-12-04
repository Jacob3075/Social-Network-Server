import mongoose from "mongoose";
import { compareSync, genSaltSync, hashSync } from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET_KEY = "some-secret-key";

const UserSchema = new mongoose.Schema({
  userName: {
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
    required: false,
    default: []
  },
  registeredEvents: {
    type: Array,
    required: false,
    default: []
  }
});

UserSchema.statics.generateHash = (password) => hashSync(password, genSaltSync(8), null);

UserSchema.methods.validatePassword = function(password) {
  return compareSync(password, this.password);
};

UserSchema.methods.getAuthToken = function() {
  return jwt.sign(
    {
      id: this._id,
      userName: this.userName
    },
    SECRET_KEY,
    { expiresIn: "3h" }
  );
};

UserSchema.query.updateFollowedTopics = function(id, topicId) {
  return this.findOneAndUpdate({ _id: id }, { $addToSet: { followedTopics: topicId } });
};

UserSchema.query.updateRegisteredEvents = function(id, eventId, unRegister) {
  if (unRegister) {
    return this.findOneAndUpdate({ _id: id }, { $pull: { registeredEvents: eventId } });
  } else {
    return this.findOneAndUpdate({ _id: id }, { $addToSet: { registeredEvents: eventId } });
  }
};

UserSchema.query.byUserName = function(userName) {
  return this.findOne({ userName: userName });
};

UserSchema.query.byId = function(id) {
  return this.findOne({ _id: id });
};

const User = mongoose.model("User", UserSchema);

export default User;
