import Profile from './entitie/profile-entitie';
import { ProfileEntitie } from './entitie/profile-entitie';

export class ProfileService {
    constructor() { }

    public async createProfile(profile: ProfileEntitie): Promise<ProfileEntitie> {
        return await Profile.create(profile);
    }

}
