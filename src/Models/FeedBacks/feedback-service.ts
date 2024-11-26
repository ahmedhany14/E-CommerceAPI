import Feedbacks from "./entitie/feedback-entitie";
import { feedbackDocument } from "./entitie/IFeedback";

class FeedbackService {
    constructor() { }


    public async createFeedBack(feedback: feedbackDocument): Promise<feedbackDocument> {
        const comment = await Feedbacks.create(feedback);
        return comment;
    }

    public async getFeedBacks(id: string): Promise<feedbackDocument> {
        const comment: any = await Feedbacks.find({
            productID: id
        }).populate('profileID')
        return comment;
    }

}

const feedbackService = new FeedbackService();
export default feedbackService