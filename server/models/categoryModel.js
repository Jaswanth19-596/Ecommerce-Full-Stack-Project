import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    // unique: true,
    trim: true,
  },

  slug: {
    type: String,
  },
});

const model = new mongoose.model('Category', categorySchema);
export default model;
