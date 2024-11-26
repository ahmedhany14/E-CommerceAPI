import { requestBody } from '../../Common/interfaces/auth-types';
import sharp from "sharp";

export async function imgConfig(request: requestBody): Promise<void> {
    const imgPath = `profile-${request.user.profileID}.jpeg`;

    await sharp(request.file?.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`photos/profile/${imgPath}`);
};