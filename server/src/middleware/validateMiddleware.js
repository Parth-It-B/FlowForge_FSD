// Validation for user registration
export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Name is required and must be at least 2 characters long.',
    });
  }

  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'A valid email address is required.',
    });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password is required and must be at least 6 characters long.',
    });
  }

  // Prevent privilege escalation: ignore any client-supplied role in registration
  delete req.body.role;

  next();
};

// Validation for user login
export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Both email and password are required.',
    });
  }

  next();
};

// Validation for issue creation and updates
export const validateIssue = (req, res, next) => {
  const { title, description, status, priority } = req.body;

  // On POST (creation), title and description are strictly required
  if (req.method === 'POST') {
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Issue title is required.',
      });
    }

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Issue description is required.',
      });
    }
  }

  // Validate status enum if provided
  const validStatuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
    });
  }

  // Validate priority enum if provided
  const validPriorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
  if (priority && !validPriorities.includes(priority)) {
    return res.status(400).json({
      success: false,
      message: `Invalid priority. Must be one of: ${validPriorities.join(', ')}`,
    });
  }

  next();
};
