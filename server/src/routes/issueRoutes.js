import express from 'express';
import {
  getIssues,
  getStats,
  getIssueById,
  createIssue,
  updateIssue,
  deleteIssue,
} from '../controllers/issueController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { validateIssue } from '../middleware/validateMiddleware.js';

const router = express.Router();

// All issue routes require an authenticated user session
router.use(verifyToken);

router.route('/')
  .get(getIssues)
  .post(validateIssue, createIssue);

router.get('/stats', getStats);

router.route('/:id')
  .get(getIssueById)
  .put(validateIssue, updateIssue)
  .delete(deleteIssue);

export default router;
