const mongoose = require("mongoose");

// What a single question looks like
const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true }, // array of strings
  answer: { type: String, required: true },
});

// What a Quiz looks like
const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Quiz title is required"],
    },
    category: {
      type: String,
      default: "General",
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"], // only these values allowed
      default: "medium",
    },
    questions: [questionSchema], // array of questions
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // links to the User model
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Quiz", quizSchema);
