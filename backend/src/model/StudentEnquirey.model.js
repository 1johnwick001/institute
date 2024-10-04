import mongoose from "mongoose";

const studentEnquirySchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
    mathAnswer: {
      type: Number,
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    status: {
        type: Number,
        default: 1, // Default status is 1 , 0{for inactive} and 8
    },
});

const StudentEnquiry = mongoose.model('Enquiry', studentEnquirySchema);

export default StudentEnquiry