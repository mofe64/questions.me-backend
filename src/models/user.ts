import { model, Schema } from "mongoose";
import { IUser } from "./user.interface";
import validator from "validator";
import bcrypt from "bcryptjs";

const userSchema: Schema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, "Email is a required field for user"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Email provided is not valid"],
  },
  password: {
    type: String,
    required: [true, "please provide a password"],
    minlength: 8,
  },
  username: {
    type: String,
    unique: true,
    required: [true, "username is a required field for user"],
  },
  firstname: {
    type: String,
    required: [true, "firstname is a required field for user"],
  },
  lastname: {
    type: String,
    required: [true, "lastname is a required field for user"],
  },
  active: {
    type: Boolean,
    default: true,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = model<IUser>("User", userSchema);
export default User;
