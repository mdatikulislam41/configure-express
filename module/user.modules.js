const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const refreshTokenSchema = Schema({
  token: String,
  device: String,
  createdAt: { type: Date, default: Date.now },
});
const userSchema = Schema(
  {
    username: {
      type: String,
      required: [true, "username required"],
      unique: true,
      index: true,
      minLength: [5, "minimum length 5"],
      maxLength: [20, "maximum length 8"],
    },
    email: {
      type: String,
      required: [true, "username required"],
      unique: true,
      index: true,
    },
    password: {
      type: String,
      // minLength: [1, "minimum length 5"],
      // maxLength: [20, "maximum length 8"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    tokenVersion: { type: Number, default: 0 },
    refreshTokens: [refreshTokenSchema],
  },
  { versionKey: false },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next;
  } catch (error) {
    next(error);
  }
});
// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
const userMoules = model("users", userSchema);
module.exports = { userMoules };
