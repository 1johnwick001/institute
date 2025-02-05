import mongoose from 'mongoose';

const NewsEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: null,
  },
  time: {
    type: String,
    default: null,
  },
  images: [
    {
      type: String,
      default: [],
    },
  ],
}, { timestamps: true });

const NewsEvent = mongoose.model('NewsEvent', NewsEventSchema);

export default NewsEvent;