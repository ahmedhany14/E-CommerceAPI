import mongoose from "mongoose";

import { feedbackDocument } from "./IFeedback";

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

const Feedbacks = mongoose.model<feedbackDocument>('Feedbacks', feedbackSchema);

export default Feedbacks;