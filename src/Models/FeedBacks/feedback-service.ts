import Feedbacks from "./entitie/feedback-entitie";
import { feedbackEntitie } from "./entitie/feedback-entitie";

class FeedbackService {
    constructor() { }


    public async createFeedBack(feedback: feedbackEntitie): Promise<feedbackEntitie> {
        const comment = await Feedbacks.create(feedback);
        return comment;
    }

    public async getFeedBacks(id: string): Promise<feedbackEntitie> {
        const comment: any = await Feedbacks.find({
            productID: id
        }).populate('profileID')
        return comment;
    }

}

const feedbackService = new FeedbackService();
export default feedbackService