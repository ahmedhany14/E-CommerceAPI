import mongoose from "mongoose";
import { IBookMarkDocument } from "./IBookMark";
import { bookmarkActions } from "./BookMarkActions";

const BookMarkSchema: mongoose.Schema = new mongoose.Schema({
    profileId: {
        type: mongoose.Types.ObjectId,
        required: true,
        unique: true,
        ref: 'Profile'
    },
    productId: [{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Product'
    }],
});

bookmarkActions(BookMarkSchema);
const BookMark = mongoose.model<IBookMarkDocument>("BookMark", BookMarkSchema);

export default BookMark;