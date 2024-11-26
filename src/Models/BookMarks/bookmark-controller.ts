import { Request, Response } from "express";

import { Get, Post, Delete } from "../../Common/Decorators/routes";
import { Controller } from "../../Common/Decorators/controller";
import { use } from "../../Common/Decorators/use";

import { requestBody } from "../../Common/interfaces/auth-types";
import { authService } from "../auth/service/auth-service";
import { bookmarkService } from "./bookmark-service";

@Controller("/bookmarks")
class BookmarkController {
    @Get("/")
    @use(authService.protectedRoute)
    public async getBookmarks(request: requestBody, response: Response) {
        const bookmarks = await bookmarkService.getBookmarks(request.user.profileID);

        response.status(200).json({
            message: "Bookmarks fetched",
            bookmarks,
        });
    }

    @Post("/")
    @use(authService.protectedRoute)
    public async addBookmark(request: requestBody, response: Response) {
        const { productID } = request.body;
        const bookmark = await bookmarkService.addBookmark(request.user.profileID, productID);

        response.status(201).json({
            message: "Bookmark added",
            bookmark,
        });
    }

    @Delete("/:id")
    @use(authService.protectedRoute)
    public async deleteBookmark(request: requestBody, response: Response) {
        const { id } = request.params;
        await bookmarkService.deleteBookmark(request.user.profileID, id);

        response.status(200).json({
            message: "Bookmark deleted",
        });
    }
}
