import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: 0, // 0-> normal user and 1-> admin
    },
    cart: [
      {
        type: mongoose.ObjectId,
        ref: 'Product',
      },
    ],
  },
  { timestamps: true }
);

const userModel = new mongoose.model('users', userSchema);

export default userModel;
