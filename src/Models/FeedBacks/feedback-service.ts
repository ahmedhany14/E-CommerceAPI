import Feedbacks from "./entitie/feedback-entitie";
import { feedbackEntitie } from "./entitie/feedback-entitie";

class FeedbackService {
    constructor() { }


    public async createFeedBack(feedback: feedbackEntitie): Promise<feedbackEntitie> {
        const comment = await Feedbacks.create(feedback);
        return comment;
    }
}