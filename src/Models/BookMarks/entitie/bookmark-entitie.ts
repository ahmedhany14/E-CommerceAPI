import mongoose from "mongoose";

export interface BookMarkEntitie {
    profileId: mongoose.Types.ObjectId;
    productId: Array<mongoose.Types.ObjectId>;
    save(): Promise<BookMarkEntitie>;
}

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

BookMarkSchema.index({ profileId: 1 }, { unique: true }); // to prevent duplicate bookmarks
const BookMark = mongoose.model<BookMarkEntitie>("BookMark", BookMarkSchema);

export default BookMark;