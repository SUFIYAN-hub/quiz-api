const express = require("express");
const router  = express.Router();
const Quiz    = require("../models/Quiz");
const protect = require("../middleware/protect");

// ============================================
// GET /api/quizzes — get all quizzes (public)
// ============================================
router.get("/", async (req, res) => {
  try {
    const quizzes = await Quiz.find().select("-questions"); // don't send questions in list
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============================================
// GET /api/quizzes/:id — get one quiz with questions (public)
// ============================================
router.get("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============================================
// POST /api/quizzes — create a quiz (protected)
// ============================================
router.post("/", protect, async (req, res) => {
  const { title, category, difficulty, questions } = req.body;

  try {
    const quiz = await Quiz.create({
      title,
      category,
      difficulty,
      questions,
      createdBy: req.user._id  // from the protect middleware
    });
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============================================
// DELETE /api/quizzes/:id — delete a quiz (protected)
// ============================================
router.delete("/:id", protect, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Only the creator can delete it
    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await quiz.deleteOne();
    res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;