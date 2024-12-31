import { auth } from '../config/firebase';

export const UserModel = {
  verifyToken: async (token: string) => {
    try {
      const decodedToken = await auth.verifyIdToken(token);
      return decodedToken;
    } catch (error) {
      return null;
    }
  },

  getUserById: async (uid: string) => {
    try {
      const user = await auth.getUser(uid);
      return user;
    } catch (error) {
      return null;
    }
  }
}; 