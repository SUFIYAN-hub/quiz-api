const mongoose = require("mongoose");
const dotenv   = require("dotenv");
const Quiz     = require("./models/Quiz");
const User     = require("./models/User");
const bcrypt   = require("bcryptjs");

dotenv.config();

// ============================================
// SEED DATA
// ============================================

const seedUser = {
  name: "Admin",
  email: "admin@quiz.com",
  password: "123456"
};

const seedQuizzes = [
  {
    title: "Web Development Basics",
    category: "Programming",
    difficulty: "easy",
    questions: [
      {
        question: "Which language runs in the browser?",
        options: ["Python", "Java", "JavaScript", "C++"],
        answer: "JavaScript"
      },
      {
        question: "What does CSS stand for?",
        options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"],
        answer: "Cascading Style Sheets"
      },
      {
        question: "Which HTML tag is used for a link?",
        options: ["<link>", "<href>", "<a>", "<url>"],
        answer: "<a>"
      },
      {
        question: "What does HTML stand for?",
        options: ["Hyper Text Markup Language", "High Text Machine Language", "Hyper Transfer Markup Language", "None"],
        answer: "Hyper Text Markup Language"
      },
      {
        question: "Which property is used to change text color in CSS?",
        options: ["font-color", "text-color", "color", "foreground"],
        answer: "color"
      }
    ]
  },
  {
    title: "React JS Basics",
    category: "Frontend",
    difficulty: "medium",
    questions: [
      {
        question: "What hook is used to remember values in React?",
        options: ["useEffect", "useState", "useRef", "useMemo"],
        answer: "useState"
      },
      {
        question: "What does JSX stand for?",
        options: ["JavaScript XML", "Java Syntax Extension", "JavaScript Extension", "None of these"],
        answer: "JavaScript XML"
      },
      {
        question: "Which hook runs code after every render?",
        options: ["useState", "useRef", "useEffect", "useContext"],
        answer: "useEffect"
      },
      {
        question: "How do you pass data to a child component?",
        options: ["state", "props", "context", "redux"],
        answer: "props"
      },
      {
        question: "What does the dependency array in useEffect do?",
        options: ["Stores variables", "Controls when effect runs", "Imports modules", "Nothing"],
        answer: "Controls when effect runs"
      }
    ]
  },
  {
    title: "Node.js & Express",
    category: "Backend",
    difficulty: "medium",
    questions: [
      {
        question: "What is Node.js?",
        options: ["A browser", "A JavaScript runtime outside the browser", "A database", "A CSS framework"],
        answer: "A JavaScript runtime outside the browser"
      },
      {
        question: "Which function starts an Express server?",
        options: ["app.start()", "app.listen()", "app.run()", "app.connect()"],
        answer: "app.listen()"
      },
      {
        question: "What does REST stand for?",
        options: ["Remote Encoding State Transfer", "Representational State Transfer", "Request State Transfer", "None"],
        answer: "Representational State Transfer"
      },
      {
        question: "Which HTTP method is used to CREATE data?",
        options: ["GET", "PUT", "POST", "DELETE"],
        answer: "POST"
      },
      {
        question: "What does middleware do in Express?",
        options: ["Stores data", "Runs between request and response", "Connects to database", "Sends emails"],
        answer: "Runs between request and response"
      }
    ]
  },
  {
    title: "JavaScript Fundamentals",
    category: "Programming",
    difficulty: "easy",
    questions: [
      {
        question: "Which keyword declares a constant in JS?",
        options: ["var", "let", "const", "def"],
        answer: "const"
      },
      {
        question: "What does typeof [] return?",
        options: ["array", "object", "list", "undefined"],
        answer: "object"
      },
      {
        question: "Which method removes last item from array?",
        options: ["push()", "pop()", "shift()", "splice()"],
        answer: "pop()"
      },
      {
        question: "What is === in JavaScript?",
        options: ["Assignment operator", "Loose equality", "Strict equality", "Not equal"],
        answer: "Strict equality"
      },
      {
        question: "What does async/await do?",
        options: ["Makes code run faster", "Handles promises in a cleaner way", "Creates new threads", "Stops execution"],
        answer: "Handles promises in a cleaner way"
      }
    ]
  },
  {
    title: "MongoDB Basics",
    category: "Database",
    difficulty: "hard",
    questions: [
      {
        question: "What type of database is MongoDB?",
        options: ["Relational", "NoSQL", "Graph", "Columnar"],
        answer: "NoSQL"
      },
      {
        question: "What is a document in MongoDB?",
        options: ["A SQL table", "A JSON-like record", "A row", "A column"],
        answer: "A JSON-like record"
      },
      {
        question: "Which method finds all documents in a collection?",
        options: ["findAll()", "find()", "getAll()", "search()"],
        answer: "find()"
      },
      {
        question: "What is a collection in MongoDB?",
        options: ["Like a table in SQL", "Like a column in SQL", "Like a row in SQL", "Like a database trigger"],
        answer: "Like a table in SQL"
      },
      {
        question: "What does Mongoose do?",
        options: ["It is a database", "It styles MongoDB data", "It is an ODM for MongoDB in Node.js", "It replaces MongoDB"],
        answer: "It is an ODM for MongoDB in Node.js"
      }
    ]
  },
  {
    title: "Git & Version Control",
    category: "Tools",
    difficulty: "easy",
    questions: [
      {
        question: "What does git init do?",
        options: ["Deletes a repo", "Creates a new git repository", "Pushes code", "Merges branches"],
        answer: "Creates a new git repository"
      },
      {
        question: "Which command stages all changes?",
        options: ["git commit", "git push", "git add .", "git pull"],
        answer: "git add ."
      },
      {
        question: "What does git push do?",
        options: ["Downloads code", "Uploads local commits to remote", "Creates a branch", "Merges code"],
        answer: "Uploads local commits to remote"
      },
      {
        question: "What is a branch in Git?",
        options: ["A copy of the database", "An independent line of development", "A commit message", "A merge conflict"],
        answer: "An independent line of development"
      },
      {
        question: "Which command shows commit history?",
        options: ["git status", "git diff", "git log", "git show"],
        answer: "git log"
      }
    ]
  }
];

// ============================================
// IMPORT — adds data to database
// ============================================
const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    // Clear existing data first
    await Quiz.deleteMany();
    await User.deleteMany();
    console.log("🗑️  Cleared existing data");

    // Create admin user
    const hashedPassword = await bcrypt.hash(seedUser.password, 10);
    const user = await User.create({ ...seedUser, password: hashedPassword });
    console.log("👤 Admin user created");

    // Attach user id to every quiz
    const quizzesWithUser = seedQuizzes.map(quiz => ({
      ...quiz,
      createdBy: user._id
    }));

    // Insert all quizzes
    await Quiz.insertMany(quizzesWithUser);
    console.log(`🎉 ${seedQuizzes.length} Quizzes inserted successfully!`);

    console.log("\n📋 Login credentials:");
    console.log("   Email:    admin@quiz.com");
    console.log("   Password: 123456\n");

    process.exit(0); // success — exit cleanly

  } catch (error) {
    console.error("❌ Seeder error:", error.message);
    process.exit(1); // error — exit with failure
  }
};

// ============================================
// DESTROY — wipes all data from database
// ============================================
const destroyData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    await Quiz.deleteMany();
    await User.deleteMany();

    console.log("🗑️  All data destroyed successfully");
    process.exit(0);

  } catch (error) {
    console.error("❌ Destroy error:", error.message);
    process.exit(1);
  }
};

// ============================================
// Run import or destroy based on CLI flag
// node seeder.js          → imports data
// node seeder.js -d       → destroys data
// ============================================
if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}