import Profile from './entitie/profile-entitie';
import { ProfileEntitie } from './entitie/profile-entitie';
import { ProfileUpdateData } from '../../interfaces/profileUpdateData';
class ProfileService {
    constructor() { }

    public async createProfile(profile: ProfileEntitie): Promise<ProfileEntitie> {
        return await Profile.create(profile);
    }

    public async findProfileById(id: string): Promise<ProfileEntitie> {
        const profile = await Profile.findById(id) as ProfileEntitie;
        return profile as ProfileEntitie;
    }

    public async updateProfile(id: string, data: ProfileUpdateData): Promise<ProfileEntitie> {
        const profile = await Profile.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true
        })

        return profile as ProfileEntitie;
    }
}

export const profileService = new ProfileService(); 