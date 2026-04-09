import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: {
    type: String,
    default: "https://t4.ftcdn.net/jpg/05/09/59/75/240_F_509597532_RKUuYsERhODmkxkZd82pSHnFtDAtgbzJ.jpg",
  },
  address: { type: String, default: "" },
  age: { type: Number, default: null },
  profession: { type: String, default: "" },
  mobileNumber: { type: String, default: "" },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
