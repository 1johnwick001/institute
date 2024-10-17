import mongoose from 'mongoose';

const NewsEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: null,  // Optional, default value can be null
  },
  time: {
    type: String,
    default: null,  // Optional, default value can be null
  },
  images: [
    {
      type: String,
      default: [],  // Optional, default value can be an empty array
    },
  ],
}, { timestamps: true });

const NewsEvent = mongoose.model('NewsEvent', NewsEventSchema);

export default NewsEvent;