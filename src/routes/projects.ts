import express, { Request, Response } from 'express';
import { db } from '../config/firebase';
import { authMiddleware } from '../middleware/auth';
import { Project } from '../types';

const router = express.Router();

// Reorder endpoint'ini en üste taşıyalım (Get all projects'ten önce)
router.put('/reorder', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { orders } = req.body as { orders: { id: string; order: number }[] };
    
    // Batch işlemi başlat
    const batch = db.batch();
    
    orders.forEach(({ id, order }) => {
      const projectRef = db.collection('projects').doc(id);
      batch.update(projectRef, { order, updatedAt: new Date() });
    });
    
    await batch.commit();
    
    res.json({ message: 'Projects reordered successfully' });
  } catch (error) {
    console.error('Error reordering projects:', error);
    res.status(500).json({ message: 'Error reordering projects' });
  }
});

// Get all projects
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const projectsSnapshot = await db.collection('projects')
      .orderBy('order', 'asc')
      .get();
      
    const projects = projectsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(projects);
  } catch (error) {
    console.error('Error getting projects:', error);
    res.status(500).json({ message: 'Error getting projects' });
  }
});

// Get single project
router.get('/:id', async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const projectDoc = await db.collection('projects').doc(req.params.id).get();
    
    if (!projectDoc.exists) {
      console.log('Project not found:', req.params.id);
      return res.status(404).json({ message: 'Project not found' });
    }

    const project = {
      id: projectDoc.id,
      ...projectDoc.data()
    };

    // console.log('Found project:', project);
    return res.json(project);
  } catch (error) {
    console.error('Error getting project:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Create project (protected)
router.post('/', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    // En son order değerini bul
    const lastProject = await db.collection('projects')
      .orderBy('order', 'desc')
      .limit(1)
      .get();

    const nextOrder = lastProject.empty ? 0 : (lastProject.docs[0].data().order || 0) + 1;

    const projectData = {
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      fullDescription: req.body.fullDescription,
      thumbnailImage: req.body.thumbnailImage,
      images: req.body.images,
      technologies: req.body.technologies,
      demoUrl: req.body.demoUrl,
      githubUrl: req.body.githubUrl,
      order: nextOrder,
      createdAt: new Date()
    };

    const docRef = await db.collection('projects').add(projectData);
    const newProject = await docRef.get();

    res.status(201).json({
      id: newProject.id,
      ...newProject.data()
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Error creating project' });
  }
});

// Update project (protected)
router.put('/:id', authMiddleware, async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const projectRef = db.collection('projects').doc(req.params.id);
    const project = await projectRef.get();

    if (!project.exists) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await projectRef.update({
      ...req.body,
      updatedAt: new Date()
    });

    const updatedProject = await projectRef.get();
    res.json({
      id: updatedProject.id,
      ...updatedProject.data()
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Error updating project' });
  }
});

// Delete project (protected)
router.delete('/:id', authMiddleware, async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const projectRef = db.collection('projects').doc(req.params.id);
    const project = await projectRef.get();

    if (!project.exists) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await projectRef.delete();
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Error deleting project' });
  }
});

export default router; 