import Profile from './entitie/profile-entitie';
import { ProfileEntitie } from './entitie/profile-entitie';

class ProfileService {
    constructor() { }

    public async createProfile(profile: ProfileEntitie): Promise<ProfileEntitie> {
        return await Profile.create(profile);
    }

    public async findProfileById(id: string): Promise<ProfileEntitie | null> {
        const profile = await Profile.findById(id);

        if (!profile) {
            return null;
        }
        return profile as ProfileEntitie;
    }
}

export const profileService = new ProfileService(); 