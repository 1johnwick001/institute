import mongoose from 'mongoose';

const BackgroundBannerSchema = new mongoose.Schema ({
    heading: {
        type: String,
    },
    subHeading: { 
        type: String,
    },
    image: { 
        type: String
    },
},{timestamps:true});

const BackgroundBanner = mongoose.model('BackgroundBanner',BackgroundBannerSchema);

export default BackgroundBanner;