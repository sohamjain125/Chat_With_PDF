import express from 'express';

const router = express.Router();

// Placeholder routes for future authentication implementation
router.get('/status', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Authentication system coming soon',
    authenticated: false 
  });
});

export default router;
