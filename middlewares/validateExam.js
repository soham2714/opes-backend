export const validateExam = (req, res, next) => {
  const { title, description, date, duration, questions } = req.body;

  try {
    // Validate required fields
    if (!title || !description || !date || !duration) {
      throw new Error('All fields (title, description, date, and duration) are required.');
    }

    if (!questions || questions.length === 0) {
      throw new Error('An exam must have at least one question.');
    }

    // Validate each question
    questions.forEach((question, index) => {
      if (!question.type || !['descriptive', 'image-based'].includes(question.type)) {
        throw new Error(`Question ${index + 1} must have a valid type: \"descriptive\" or \"image-based\".`);
      }

      if (question.type === 'descriptive' && !question.text) {
        throw new Error(`Text is required for descriptive question ${index + 1}.`);
      }

      if (question.type === 'image-based' && !question.image) {
        throw new Error(`Image URL is required for image-based question ${index + 1}.`);
      }

      if (question.options && question.options.length !== 4) {
        throw new Error(`Question ${index + 1} must have exactly 4 options for multiple-choice questions.`);
      }

      if (question.correctAnswer && (question.correctAnswer < 1 || question.correctAnswer > 4)) {
        throw new Error(`Correct answer for question ${index + 1} must be a number between 1 and 4.`);
      }
    });

    // Proceed to the next middleware or controller
    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};