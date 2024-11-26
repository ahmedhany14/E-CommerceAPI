import BookMark from './entitie/bookmark-entitie';
import {IBookMarkDocument} from './entitie/IBookMark';

class BookMarkService {

    public async getBookmarks(profileId: string): Promise<IBookMarkDocument | null> {
        const bookmarks = await BookMark.findOne({ profileId }).populate('productId');
        return bookmarks;
    }

    public async addBookmark(profileId: string, productId: string): Promise<IBookMarkDocument> {
        if (!await this.getBookmarks(profileId)) {
            return await BookMark.create({ profileId, productId });
        }
        else {
            return await BookMark.findOneAndUpdate({ profileId }, { $push: { productId } }) as IBookMarkDocument;
        }
    }

    public async deleteBookmark(profileId: string, productId: string): Promise<IBookMarkDocument> {
        const bookmarks = await this.getBookmarks(profileId);
        if (bookmarks) {
            bookmarks.productId = bookmarks.productId.filter((product) => product._id.toString() !== productId);
            await bookmarks.save();
        }
        return bookmarks as IBookMarkDocument;
    }
}

const bookmarkService = new BookMarkService();
export { bookmarkService };