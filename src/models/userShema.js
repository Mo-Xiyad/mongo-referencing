import mongoose from "mongoose";
import validator from "validator";
import { isEmail } from "validator";
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      validate: [isEmail, "invalid email"],
    },
    avatar: { type: String },
  },
  {
    timestamps: true,
  }
);

export default model("User", userSchema);
