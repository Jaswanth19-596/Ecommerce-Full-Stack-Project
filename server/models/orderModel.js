import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.ObjectId,
        ref: 'Product',
      },
    ],
    payment: {},
    buyer: {
      type: mongoose.ObjectId,
      ref: 'users',
    },
    status: {
      type: String,
      default: 'Not process',
      enum: ['Not process', 'processing', 'Shipping', 'Delivered', 'Cancelled'],
    },
  },
  { timestamps: true }
);

const model = new mongoose.model('Order', orderSchema);
export default model;
