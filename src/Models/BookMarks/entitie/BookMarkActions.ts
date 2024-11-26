import mongoose from "mongoose";
import { IBookMarkDocument } from "./IBookMark";


export function bookmarkActions(Schema: mongoose.Schema) {
    Schema.index({ profileId: 1 }, { unique: true }); // to prevent duplicate bookmarks
}