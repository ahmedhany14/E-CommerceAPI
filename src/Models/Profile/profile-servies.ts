import Profile from './entitie/profile-entitie';
import { ProfileDocument } from './entitie/IProfile';
import { ProfileUpdateData } from '../../interfaces/profileUpdateData';
class ProfileService {
    constructor() { }

    public async createProfile(profile: ProfileDocument): Promise<ProfileDocument> {
        return await Profile.create(profile);
    }

    public async findProfileById(id: string): Promise<ProfileDocument> {
        const profile = await Profile.findById(id) as ProfileDocument;
        return profile as ProfileDocument;
    }

    public async updateProfile(id: string, data: ProfileUpdateData): Promise<ProfileDocument> {
        const profile = await Profile.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true
        })

        return profile as ProfileDocument;
    }
}

export const profileService = new ProfileService(); 