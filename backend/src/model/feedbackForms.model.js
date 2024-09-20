import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
    formType:{
        type:String,
        enum: ['teacher', 'employer', 'student', 'parent', 'alumni']
    },
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true 
    },
    enrollment : {
        type:String
    },
    Branch : {
        type:String
    },
    Year : {
        type:String
    },
    department : {
        type:String
    },
    organization : {
        type:String
    },
    designation : {
        type:String
    },
    presentOrganization : {
        type:String
    },
    batchOfYear : {
        type:String
    },
    mobileNo: {
        type: String
    },
    sonDaughterName: {
        type: String,
    },
    sonDaughterBranch: {
        type: String,
    },
    sonDaughterYearOfStudy: {
        type: String,
    },
    ratings: [
        {
            parameter: { type: String },
            rating: { type: Number, min: 1, max: 5 }
        }
    ]
}, { timestamps: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;