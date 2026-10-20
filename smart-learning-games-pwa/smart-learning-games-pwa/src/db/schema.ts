import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  primaryKey,
} from "drizzle-orm/pg-core";

// Student profiles
export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  classLevel: integer("class_level").notNull().default(1),
  preferredLanguage: text("preferred_language").notNull().default("english"),
  dailyGoal: integer("daily_goal").default(10),
  totalStars: integer("total_stars").default(0),
  totalCoins: integer("total_coins").default(0),
  streak: integer("streak").default(0),
  lastActiveDate: timestamp("last_active_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Badges
export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  category: text("category").notNull(),
});

// Student badges (many-to-many)
export const studentBadges = pgTable("student_badges", {
  studentId: integer("student_id").references(() => students.id),
  badgeId: integer("badge_id").references(() => badges.id),
  earnedAt: timestamp("earned_at").defaultNow(),
}, (t) => [
  primaryKey({ columns: [t.studentId, t.badgeId] }),
]);

// Game sessions
export const gameSessions = pgTable("game_sessions", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => students.id),
  gameMode: text("game_mode").notNull(),
  topic: text("topic"),
  classLevel: integer("class_level").notNull(),
  language: text("language").notNull(),
  score: integer("score").default(0),
  correctAnswers: integer("correct_answers").default(0),
  totalQuestions: integer("total_questions").default(0),
  timeSpent: integer("time_spent").default(0), // in seconds
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Progress tracking
export const progress = pgTable("progress", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => students.id),
  gameMode: text("game_mode").notNull(),
  topic: text("topic").notNull(),
  classLevel: integer("class_level").notNull(),
  questionsAttempted: integer("questions_attempted").default(0),
  correctAnswers: integer("correct_answers").default(0),
  lastPlayed: timestamp("last_played"),
  completed: boolean("completed").default(false),
});

// Question bank for teacher-managed content
export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  questionId: text("question_id").notNull().unique(),
  gameMode: text("game_mode").notNull(),
  subject: text("subject"),
  classLevel: integer("class_level").notNull(),
  topic: text("topic").notNull(),
  language: text("language").notNull(),
  questionText: text("question_text").notNull(),
  options: jsonb("options"),
  correctAnswer: text("correct_answer").notNull(),
  explanation: text("explanation"),
  difficulty: text("difficulty").default("medium"),
  estimatedTime: integer("estimated_time").default(30),
  metadata: jsonb("metadata"),
  createdBy: text("created_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});

// Teacher accounts
export const teachers = pgTable("teachers", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Classes managed by teachers
export const classes = pgTable("classes", {
  id: serial("id").primaryKey(),
  teacherId: integer("teacher_id").references(() => teachers.id),
  name: text("name").notNull(),
  classLevel: integer("class_level").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Class students (linking students to teacher classes)
export const classStudents = pgTable("class_students", {
  classId: integer("class_id").references(() => classes.id),
  studentId: integer("student_id").references(() => students.id),
  joinedAt: timestamp("joined_at").defaultNow(),
}, (t) => [
  primaryKey({ columns: [t.classId, t.studentId] }),
]);

// Assignments
export const assignments = pgTable("assignments", {
  id: serial("id").primaryKey(),
  teacherId: integer("teacher_id").references(() => teachers.id),
  classId: integer("class_id").references(() => classes.id),
  title: text("title").notNull(),
  gameMode: text("game_mode"),
  topic: text("topic"),
  classLevel: integer("class_level").notNull(),
  difficulty: text("difficulty").default("medium"),
  numQuestions: integer("num_questions").default(10),
  instructions: text("instructions"),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Assignment submissions
export const assignmentSubmissions = pgTable("assignment_submissions", {
  id: serial("id").primaryKey(),
  assignmentId: integer("assignment_id").references(() => assignments.id),
  studentId: integer("student_id").references(() => students.id),
  score: integer("score").default(0),
  correctAnswers: integer("correct_answers").default(0),
  totalQuestions: integer("total_questions").default(0),
  completed: boolean("completed").default(false),
  submittedAt: timestamp("submitted_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Student = typeof students.$inferSelect;
export type NewStudent = typeof students.$inferInsert;
export type Badge = typeof badges.$inferSelect;
export type NewBadge = typeof badges.$inferInsert;
export type GameSession = typeof gameSessions.$inferSelect;
export type NewGameSession = typeof gameSessions.$inferInsert;
export type Progress = typeof progress.$inferSelect;
export type NewProgress = typeof progress.$inferInsert;
export type Question = typeof questions.$inferSelect;
export type NewQuestion = typeof questions.$inferInsert;
export type Teacher = typeof teachers.$inferSelect;
export type NewTeacher = typeof teachers.$inferInsert;
export type Class = typeof classes.$inferSelect;
export type NewClass = typeof classes.$inferInsert;
export type Assignment = typeof assignments.$inferSelect;
export type NewAssignment = typeof assignments.$inferInsert;
