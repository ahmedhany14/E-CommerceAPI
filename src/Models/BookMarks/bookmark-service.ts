import BookMark from './entitie/bookmark-entitie';
import { BookMarkEntitie } from './entitie/bookmark-entitie';

class BookMarkService {

    public async getBookmarks(profileId: string): Promise<BookMarkEntitie | null> {
        const bookmarks = await BookMark.findOne({ profileId }).populate('productId');
        return bookmarks;
    }

    public async addBookmark(profileId: string, productId: string): Promise<BookMarkEntitie> {
        if (!await this.getBookmarks(profileId)) {
            return await BookMark.create({ profileId, productId });
        }
        else {
            return await BookMark.findOneAndUpdate({ profileId }, { $push: { productId } }) as BookMarkEntitie;
        }
    }

    public async deleteBookmark(profileId: string, productId: string): Promise<BookMarkEntitie> {
        const bookmarks = await this.getBookmarks(profileId);
        if (bookmarks) {
            bookmarks.productId = bookmarks.productId.filter((product) => product._id.toString() !== productId);
            await bookmarks.save();
        }
        return bookmarks as BookMarkEntitie;
    }
}

const bookmarkService = new BookMarkService();
export { bookmarkService };