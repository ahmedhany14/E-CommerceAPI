import { Request, Response, NextFunction } from "express";


import { feedbackDocument } from "./entitie/IFeedback";
import feedbackService from './feedback-service'

import { Delete, Get, Post } from './../../Common/Decorators/routes'
import { Controller } from '../../Common/Decorators/controller';
import { validator } from '../../Common/Decorators/validator';
import { use } from '../../Common/Decorators/use';

import { authService } from '../auth/service/auth-service';
import { requestBody } from "../../Common/interfaces/requestBody";


@Controller('/feedbacks')
class FeedbackController {

    @Post('/:productId')
    @validator('content')
    @use(authService.protectedRoute)
    public async pushFeedback(request: requestBody, response: Response, next: NextFunction) {
        const content = request.body.content;
        const productID = request.params.productId, profileId = request.user.profileID
        const feedback = {
            content,
            postTime: new Date(),
            profileID: profileId,
            productID: productID,
        }

        const comment = await feedbackService.createFeedBack(feedback as feedbackDocument);

        response.status(200).json({
            message: 'succes',
            comment
        })
    }

    @Get('/:productId')
    @use(authService.protectedRoute)
    public async getProduct(request: Request, response: Response): Promise<void> {
        const review = await feedbackService.getFeedBacks(request.params.productId)
        response.status(200).json({
            status: 'success',
            review
        });
    }

}
