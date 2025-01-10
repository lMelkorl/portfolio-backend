import { db } from '../config/firebase';
import { Project } from '../types';

export const ProjectModel = {
  create: async (data: Project) => {
    const docRef = await db.collection('projects').add({
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return docRef;
  },
  findById: async (id: string) => {
    const doc = await db.collection('projects').doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },

  findAll: async () => {
    const snapshot = await db.collection('projects').orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  update: async (id: string, data: Partial<Project>) => {
    const docRef = db.collection('projects').doc(id);
    await docRef.update({
      ...data,
      updatedAt: new Date().toISOString()
    });
    const updated = await docRef.get();
    return { id: updated.id, ...updated.data() };
  },

  delete: async (id: string) => {
    await db.collection('projects').doc(id).delete();
  }
}; 