import mongoose from "mongoose";

export interface feedbackEntitie {
    content: string;
    postTime: Date;
    profileID: string;
    productID: string;
}

const feedbackSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    postTime: {
        type: Date,
    },
    profileID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
    },
    productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
    }
});

const Feedbacks = mongoose.model<feedbackEntitie>('Feedbacks', feedbackSchema);

export default Feedbacks;