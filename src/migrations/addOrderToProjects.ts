import { db } from '../config/firebase';

const addOrderToProjects = async () => {
  try {
    // Tüm projeleri createdAt'e göre sıralı şekilde al
    const projectsSnapshot = await db.collection('projects')
      .orderBy('createdAt', 'desc')
      .get();

    const batch = db.batch();
    
    // Her projeye sırayla order değeri ata
    projectsSnapshot.docs.forEach((doc, index) => {
      const projectRef = db.collection('projects').doc(doc.id);
      batch.update(projectRef, { order: index });
    });

    await batch.commit();
    console.log('✅ Successfully added order field to all projects');
  } catch (error) {
    console.error('❌ Error adding order field to projects:', error);
  }
};

export default addOrderToProjects; 