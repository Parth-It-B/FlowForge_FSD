import Issue from '../models/Issue.js';

// @route   GET /api/issues
// @desc    Get all issues with optional filtering by status and search by title
export const getIssues = async (req, res, next) => {
  try {
    const { status, search, priority } = req.query;

    const query = {};

    if (status && status !== 'ALL') {
      query.status = status;
    }

    if (priority && priority !== 'ALL') {
      query.priority = priority;
    }

    if (search && search.trim() !== '') {
      query.title = { $regex: search.trim(), $options: 'i' };
    }

    const issues = await Issue.find(query)
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: issues.length,
      data: issues,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/issues/stats
// @desc    Get aggregated statistics calculated from actual issue data
export const getStats = async (req, res, next) => {
  try {
    const [total, open, inProgress, resolved, closed, urgent] = await Promise.all([
      Issue.countDocuments(),
      Issue.countDocuments({ status: 'OPEN' }),
      Issue.countDocuments({ status: 'IN_PROGRESS' }),
      Issue.countDocuments({ status: 'RESOLVED' }),
      Issue.countDocuments({ status: 'CLOSED' }),
      Issue.countDocuments({ priority: 'URGENT' }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        open,
        inProgress,
        resolved,
        closed,
        urgent,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/issues/:id
// @desc    Get a single issue by id
export const getIssueById = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id).populate('createdBy', 'name email role');

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: issue,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/issues
// @desc    Create a new issue
export const createIssue = async (req, res, next) => {
  try {
    const { title, description, status, priority, assignedTo } = req.body;

    const issue = await Issue.create({
      title,
      description,
      status: status || 'OPEN',
      priority: priority || 'MEDIUM',
      assignedTo: assignedTo || 'Unassigned',
      createdBy: req.user.id,
    });

    const populatedIssue = await Issue.findById(issue._id).populate(
      'createdBy',
      'name email role'
    );

    res.status(201).json({
      success: true,
      data: populatedIssue,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/issues/:id
// @desc    Update an issue (creator or admin can update all fields; users can update status/assignedTo)
export const updateIssue = async (req, res, next) => {
  try {
    let issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found.',
      });
    }

    const isCreator = issue.createdBy.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    // If user is neither creator nor admin, they are unauthorized to modify this issue
    if (!isCreator && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: you are not authorized to update this issue.',
      });
    }

    const { title, description, status, priority, assignedTo } = req.body;

    if (title !== undefined) issue.title = title;
    if (description !== undefined) issue.description = description;
    if (status !== undefined) issue.status = status;
    if (priority !== undefined) issue.priority = priority;
    if (assignedTo !== undefined) issue.assignedTo = assignedTo;

    await issue.save();

    const updatedIssue = await Issue.findById(issue._id).populate(
      'createdBy',
      'name email role'
    );

    res.status(200).json({
      success: true,
      data: updatedIssue,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/issues/:id
// @desc    Delete an issue (creator or admin only)
export const deleteIssue = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found.',
      });
    }

    const isCreator = issue.createdBy.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isCreator && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: only the issue creator or an admin can delete this issue.',
      });
    }

    await issue.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Issue removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};
