import BookMark from './entitie/bookmark-entitie';
import { BookMarkEntitie } from './entitie/bookmark-entitie';

class BookMarkService {

    public async getBookmarks(profileId: string): Promise<BookMarkEntitie[]> {
        return await BookMark.find({ profileId }).populate('productId').select('-_id -__v');
    }

    public async addBookmark(profileId: string, productId: string): Promise<BookMarkEntitie> {
        return await BookMark.create({ profileId, productId });
    }

    public async deleteBookmark(profileId: string, productId: string): Promise<void> {
        await BookMark.deleteOne({ profileId, productId });
    }
}

const bookmarkService = new BookMarkService();
export { bookmarkService };