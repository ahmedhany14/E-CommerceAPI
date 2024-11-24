import mongoose from "mongoose";

export interface BookMarkEntitie {
    profileId: mongoose.Types.ObjectId;
    productId: mongoose.Types.ObjectId;
}

const BookMarkSchema: mongoose.Schema = new mongoose.Schema({
    profileId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Profile'
    },
    productId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Product'
    },
});

BookMarkSchema.index({ profileId: 1, productId: 1 }, { unique: true });
const BookMark = mongoose.model<BookMarkEntitie>("BookMark", BookMarkSchema);

export default BookMark;