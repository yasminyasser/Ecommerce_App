import mongoose, { Schema, model, Types } from "mongoose";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, "name must be required"],
      min: [3, "minimum length 3 char"],
      max: [20, "max length 20 char"],
    },
    email: {
      type: String,
      required: [, "email must be required"],
      unique: [true, "email must be unique"],
    },
    password: {
      type: String,
      required: [true, "password must be required"],
    },
    gender: {
      type: String,
      enum: ["female", "male"],
      default: "female",
    },
    phone: String,
    role: {
      type: String,
      default: "User",
      enum: ["User", "Admin"],
    },
    status: {
      type: String,
      default: "Offline",
      enum: ["Offline", "Online"],
    },
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    address: String,
    image: String,
    isDeleted: {
      type: Boolean,
      default: false,
    },
    DOB: String,
    code: String,
    //wishList :[]
  },
  { timestamps: true }
);

const userModel = mongoose.model.User || model("User", userSchema);

export default userModel;
