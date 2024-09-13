import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({

    postAppliedFor : {
        type: String,
        required: true 
    },
    department: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
      surname: {
        type: String,
        required: true
    },
      gender: {
        type: String,
        required: true,
    },
      dateOfBirth: {
        type: Date,
        required: true
    },
      addressForCorrespondence: {
        type: String,
        required: true
    },
      telephoneNo: {
        type: String,
        required: true
    },
      cellNo: {
        type: String,
        required: true
    },
      alternateCellNo: {
        type: String
    },
      emailAddress: {
        type: String,
        required: true
    },
      alternateEmail: {
        type: String
    },
    educationalQualification: {
        ug: {
          yearOfPassing: Number,
          passingPercentage: Number,
          divisionOfPassing: String,
          fieldOfSpecialization: String
        },
        pg: {
          yearOfPassing: Number,
          passingPercentage: Number,
          divisionOfPassing: String,
          fieldOfSpecialization: String
        },
        mphil: {
          yearOfPassing: Number,
          passingPercentage: Number,
          divisionOfPassing: String,
          fieldOfSpecialization: String
        },
        phd: {
          yearOfPassing: Number,
          passingPercentage: Number,
          divisionOfPassing: String,
          fieldOfSpecialization: String
        }
    },
    nationalStateLevelExamination: {
        qualifiedExamName: String,
        qualifyingYear: Number
    },
    workExperience: {
        teaching: Number,
        industry: Number,
        research: Number
    },
    resume : {
        type : String,
        required :true
    }
})

const Application = mongoose.model('Application', applicationSchema);

export default Application