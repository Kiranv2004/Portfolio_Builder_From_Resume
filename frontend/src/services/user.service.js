import api from './api';

class UserService {
    getUserProfile() {
        return api.get('/user/profile');
    }

    updateUserProfile(profileData) {
        return api.put('/user/profile', profileData);
    }
}

export default new UserService();
