import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let supabase = null;
let pgPool = null;

if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
  try {
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    console.log('⚡ Connected to Supabase Client');
  } catch (err) {
    console.warn('Supabase initialization fallback:', err.message);
  }
}

if (process.env.DATABASE_URL) {
  try {
    const { Pool } = pg;
    pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    console.log('⚡ Initialized Direct PostgreSQL Connection Pool');
  } catch (err) {
    console.warn('Postgres Pool initialization fallback:', err.message);
  }
}

// Load seed courses
const rawSeedData = fs.readFileSync(path.join(__dirname, '../data/courses_seed.json'), 'utf8');
const initialCourses = JSON.parse(rawSeedData);

// In-Memory stores for instant robust local operation fallback
const mockUserStore = new Map();
const mockCourseStore = new Map();
const mockFavoritesStore = new Map(); // userId -> Set of courseIds
const mockProgressStore = new Map(); // "userId:courseId" -> status ('Not Started', 'In Progress', 'Completed')
const mockRecentlyViewedStore = new Map(); // userId -> Array of { courseId, timestamp }
const mockQuestionsStore = new Map(); // questionId -> Question
const mockAnswersStore = new Map(); // answerId -> Answer
const mockUpvotesStore = new Set(); // "answerId:userId"
const mockNotificationsStore = new Map(); // notificationId -> Notification
const mockMentorshipRequestsStore = new Map(); // requestId -> MentorshipRequest

// Seed initial courses into memory store
initialCourses.forEach(course => {
  mockCourseStore.set(course.id, course);
});

// Seed demo admin & mentor users
const demoAdmin = {
  id: 'admin-001',
  full_name: 'Admin User',
  email: 'admin@pathpilot.dev',
  password_hash: '$2a$10$w09u7uR/x3lJ39iC0R3W4.25S5T8zK3aF6K7', // hashed mock password 'admin123'
  role: 'admin',
  is_mentor: true,
  avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
  bio: 'Platform Lead Administrator & Career Mentor',
  skills: ['System Architecture', 'Leadership', 'Career Guidance'],
  interests: ['EdTech', 'Full Stack', 'Cloud'],
  github_url: 'https://github.com',
  linkedin_url: 'https://linkedin.com',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};
mockUserStore.set(demoAdmin.email, demoAdmin);

const demoMentor = {
  id: 'mentor-001',
  full_name: 'Sarah Connor',
  email: 'sarah.mentor@pathpilot.dev',
  password_hash: '$2a$10$w09u7uR/x3lJ39iC0R3W4.25S5T8zK3aF6K7',
  role: 'student',
  is_mentor: true,
  avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah%20Connor',
  bio: 'Senior Full-Stack Engineer at TechCorp. Happy to help junior devs with React & Node architecture.',
  skills: ['React', 'Node.js', 'PostgreSQL', 'System Design'],
  interests: ['Web Development', 'Open Source', 'Mentorship'],
  github_url: 'https://github.com',
  linkedin_url: 'https://linkedin.com',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};
mockUserStore.set(demoMentor.email, demoMentor);

// Seed initial questions & answers
const seedQuestion1 = {
  id: 'q-meta-01',
  course_id: 'meta-full-stack-developer',
  author_id: demoMentor.id,
  author_name: demoMentor.full_name,
  author_avatar: demoMentor.avatar_url,
  author_is_mentor: demoMentor.is_mentor,
  title: 'How should I structure the React frontend and Node backend project folders?',
  content: 'I am taking the Meta Full Stack Developer course and building my capstone project. What is the recommended folder layout for seamless deployment?',
  tags: ['React', 'Node.js', 'Project Structure', 'Architecture'],
  best_answer_id: 'ans-meta-01',
  created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
  updated_at: new Date(Date.now() - 3600000 * 48).toISOString()
};
mockQuestionsStore.set(seedQuestion1.id, seedQuestion1);

const seedAnswer1 = {
  id: 'ans-meta-01',
  question_id: 'q-meta-01',
  author_id: demoMentor.id,
  author_name: demoMentor.full_name,
  author_avatar: demoMentor.avatar_url,
  author_is_mentor: demoMentor.is_mentor,
  content: 'The most clean approach is a dual client/server root layout. Create a `client/` folder with Vite React and a `server/` folder with Express. In production, build Vite into static assets and let Express serve `/api` endpoints with CORS configured properly.',
  upvotes_count: 7,
  created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  updated_at: new Date(Date.now() - 3600000 * 24).toISOString()
};
mockAnswersStore.set(seedAnswer1.id, seedAnswer1);
mockUpvotesStore.add(`${seedAnswer1.id}:${demoAdmin.id}`);

const seedQuestion2 = {
  id: 'q-ai-01',
  course_id: 'coursera-machine-learning-specialization-andrew-ng',
  author_id: demoAdmin.id,
  author_name: demoAdmin.full_name,
  author_avatar: demoAdmin.avatar_url,
  author_is_mentor: demoAdmin.is_mentor,
  title: 'Prerequisites for Andrew Ng Machine Learning Specialization?',
  content: 'Is high-level calculus required before jumping into Andrew Ng Specialization on Coursera, or is basic Python & linear algebra sufficient?',
  tags: ['Python', 'Machine Learning', 'Math', 'Beginner'],
  best_answer_id: null,
  created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  updated_at: new Date(Date.now() - 3600000 * 12).toISOString()
};
mockQuestionsStore.set(seedQuestion2.id, seedQuestion2);

export const dbStore = {
  // --- USER METHODS ---
  async findUserByEmail(email) {
    const normalizedEmail = email.toLowerCase().trim();
    if (supabase) {
      const { data } = await supabase.from('users').select('*').eq('email', normalizedEmail).single();
      if (data) return data;
    }
    if (pgPool) {
      try {
        const res = await pgPool.query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);
        if (res.rows.length > 0) return res.rows[0];
      } catch (err) {
        console.warn('Postgres query error:', err.message);
      }
    }
    return mockUserStore.get(normalizedEmail) || null;
  },

  async findUserById(id) {
    if (supabase) {
      const { data } = await supabase.from('users').select('*').eq('id', id).single();
      if (data) return data;
    }
    if (pgPool) {
      try {
        const res = await pgPool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (res.rows.length > 0) return res.rows[0];
      } catch (err) {
        console.warn('Postgres query error:', err.message);
      }
    }
    for (const user of mockUserStore.values()) {
      if (user.id === id) return user;
    }
    return null;
  },

  async createUser({ fullName, email, passwordHash, role = 'student' }) {
    const normalizedEmail = email.toLowerCase().trim();
    const newUser = {
      id: crypto.randomUUID(),
      full_name: fullName,
      email: normalizedEmail,
      password_hash: passwordHash,
      role,
      is_mentor: role === 'admin',
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`,
      bio: '',
      skills: [],
      interests: [],
      github_url: '',
      linkedin_url: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (supabase) {
      const { data } = await supabase.from('users').insert([newUser]).select().single();
      if (data) return data;
    }
    if (pgPool) {
      try {
        const query = `
          INSERT INTO users (id, full_name, email, password_hash, role, is_mentor, avatar_url, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;
        `;
        const res = await pgPool.query(query, [
          newUser.id, newUser.full_name, newUser.email, newUser.password_hash,
          newUser.role, newUser.is_mentor, newUser.avatar_url, newUser.created_at, newUser.updated_at
        ]);
        if (res.rows.length > 0) return res.rows[0];
      } catch (err) {
        console.warn('Postgres insert error:', err.message);
      }
    }
    mockUserStore.set(normalizedEmail, newUser);
    return newUser;
  },

  async updateUserProfile(userId, { fullName, bio, avatarUrl, skills, interests, githubUrl, linkedinUrl }) {
    const user = await this.findUserById(userId);
    if (!user) throw new Error('User not found');

    if (fullName !== undefined) user.full_name = fullName;
    if (bio !== undefined) user.bio = bio;
    if (avatarUrl !== undefined) user.avatar_url = avatarUrl;
    if (skills !== undefined) user.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()).filter(Boolean);
    if (interests !== undefined) user.interests = Array.isArray(interests) ? interests : interests.split(',').map(i => i.trim()).filter(Boolean);
    if (githubUrl !== undefined) user.github_url = githubUrl;
    if (linkedinUrl !== undefined) user.linkedin_url = linkedinUrl;
    user.updated_at = new Date().toISOString();

    if (supabase) {
      await supabase.from('users').update({
        full_name: user.full_name,
        bio: user.bio,
        avatar_url: user.avatar_url,
        skills: user.skills,
        interests: user.interests,
        github_url: user.github_url,
        linkedin_url: user.linkedin_url,
        updated_at: user.updated_at
      }).eq('id', userId);
    }
    if (pgPool) {
      try {
        await pgPool.query(`
          UPDATE users SET full_name = $1, bio = $2, avatar_url = $3, skills = $4, interests = $5, github_url = $6, linkedin_url = $7, updated_at = $8
          WHERE id = $9
        `, [user.full_name, user.bio, user.avatar_url, user.skills, user.interests, user.github_url, user.linkedin_url, user.updated_at, userId]);
      } catch (err) {
        console.warn('Postgres update error:', err.message);
      }
    }

    mockUserStore.set(user.email.toLowerCase(), user);
    return user;
  },

  async toggleMentorStatus(userId, isMentor) {
    const user = await this.findUserById(userId);
    if (user) {
      user.is_mentor = isMentor;
      mockUserStore.set(user.email.toLowerCase(), user);
    }
    return user;
  },

  async getAllUsers() {
    return Array.from(mockUserStore.values()).map(u => {
      const { password_hash, ...safeUser } = u;
      return safeUser;
    });
  },

  async deleteUser(userId) {
    const user = await this.findUserById(userId);
    if (user) {
      mockUserStore.delete(user.email.toLowerCase());
      return true;
    }
    return false;
  },

  // --- COURSE METHODS ---
  async getCourses(filters = {}) {
    let coursesList = Array.from(mockCourseStore.values());
    if (filters.category && filters.category !== 'All') {
      coursesList = coursesList.filter(c => c.category.toLowerCase() === filters.category.toLowerCase());
    }
    if (filters.level && filters.level !== 'All') {
      coursesList = coursesList.filter(c => c.level.toLowerCase().includes(filters.level.toLowerCase()));
    }
    if (filters.priceType && filters.priceType !== 'All') {
      coursesList = coursesList.filter(c => c.price_type.toLowerCase() === filters.priceType.toLowerCase());
    }
    if (filters.platform && filters.platform !== 'All') {
      coursesList = coursesList.filter(c => c.platform.toLowerCase().includes(filters.platform.toLowerCase()));
    }
    if (filters.q) {
      const qLower = filters.q.toLowerCase();
      coursesList = coursesList.filter(c =>
        c.title.toLowerCase().includes(qLower) ||
        c.platform.toLowerCase().includes(qLower) ||
        c.category.toLowerCase().includes(qLower)
      );
    }
    return coursesList;
  },

  async getCourseById(id) {
    return mockCourseStore.get(id) || null;
  },

  async createCourse(courseData) {
    const id = courseData.id || courseData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCourse = {
      id,
      title: courseData.title,
      platform: courseData.platform || 'Online',
      duration: courseData.duration || 'Self-paced',
      price_type: courseData.price_type || 'free',
      level: courseData.level || 'Beginner',
      category: courseData.category || 'Full Stack Development',
      link: courseData.link || 'https://coursera.org',
      created_at: new Date().toISOString()
    };
    mockCourseStore.set(id, newCourse);
    return newCourse;
  },

  async updateCourse(id, courseData) {
    const existing = mockCourseStore.get(id);
    if (!existing) throw new Error('Course not found');
    const updated = { ...existing, ...courseData };
    mockCourseStore.set(id, updated);
    return updated;
  },

  async deleteCourse(id) {
    return mockCourseStore.delete(id);
  },

  // --- FAVORITES METHODS ---
  async getUserFavorites(userId) {
    const favSet = mockFavoritesStore.get(userId) || new Set();
    const favCourses = [];
    for (const courseId of favSet) {
      const course = mockCourseStore.get(courseId);
      if (course) favCourses.push(course);
    }
    return favCourses;
  },

  async addFavorite(userId, courseId) {
    if (!mockFavoritesStore.has(userId)) mockFavoritesStore.set(userId, new Set());
    mockFavoritesStore.get(userId).add(courseId);
    return true;
  },

  async removeFavorite(userId, courseId) {
    if (mockFavoritesStore.has(userId)) mockFavoritesStore.get(userId).delete(courseId);
    return true;
  },

  // --- COURSE PROGRESS METHODS ---
  async getUserCourseProgress(userId) {
    const progressList = [];
    for (const [key, status] of mockProgressStore.entries()) {
      const [uId, courseId] = key.split(':');
      if (uId === userId) {
        const course = mockCourseStore.get(courseId);
        if (course) {
          progressList.push({
            course_id: courseId,
            course_title: course.title,
            course_category: course.category,
            status
          });
        }
      }
    }
    return progressList;
  },

  async updateCourseProgress(userId, courseId, status) {
    const validStatuses = ['Not Started', 'In Progress', 'Completed'];
    if (!validStatuses.includes(status)) throw new Error('Invalid progress status');
    mockProgressStore.set(`${userId}:${courseId}`, status);
    return { userId, courseId, status };
  },

  // --- RECENTLY VIEWED METHODS ---
  async getRecentlyViewed(userId) {
    const history = mockRecentlyViewedStore.get(userId) || [];
    const result = [];
    for (const item of history) {
      const course = mockCourseStore.get(item.courseId);
      if (course) result.push(course);
    }
    return result;
  },

  async addRecentlyViewed(userId, courseId) {
    if (!mockRecentlyViewedStore.has(userId)) mockRecentlyViewedStore.set(userId, []);
    let history = mockRecentlyViewedStore.get(userId);
    history = history.filter(item => item.courseId !== courseId);
    history.unshift({ courseId, timestamp: Date.now() });
    if (history.length > 6) history = history.slice(0, 6);
    mockRecentlyViewedStore.set(userId, history);
    return true;
  },

  // --- QUESTIONS & DISCUSSIONS METHODS ---
  async getQuestions({ courseId, authorId, unanswered, q }) {
    let list = Array.from(mockQuestionsStore.values());

    if (courseId) list = list.filter(item => item.course_id === courseId);
    if (authorId) list = list.filter(item => item.author_id === authorId);
    if (unanswered) {
      list = list.filter(item => {
        const answers = Array.from(mockAnswersStore.values()).filter(a => a.question_id === item.id);
        return answers.length === 0;
      });
    }
    if (q) {
      const qLower = q.toLowerCase();
      list = list.filter(item =>
        item.title.toLowerCase().includes(qLower) ||
        item.content.toLowerCase().includes(qLower) ||
        (item.tags && item.tags.some(t => t.toLowerCase().includes(qLower)))
      );
    }

    const result = await Promise.all(list.map(async (q) => {
      const course = mockCourseStore.get(q.course_id);
      const author = await this.findUserById(q.author_id);
      const answers = Array.from(mockAnswersStore.values()).filter(a => a.question_id === q.id);
      return {
        ...q,
        course_title: course ? course.title : q.course_id,
        course_platform: course ? course.platform : '',
        author_name: author ? author.full_name : q.author_name,
        author_avatar: author ? author.avatar_url : q.author_avatar,
        author_is_mentor: author ? author.is_mentor : q.author_is_mentor,
        answers_count: answers.length
      };
    }));

    return result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async getQuestionById(questionId, currentUserId = null) {
    const q = mockQuestionsStore.get(questionId);
    if (!q) return null;

    const course = mockCourseStore.get(q.course_id);
    const author = await this.findUserById(q.author_id);

    const rawAnswers = Array.from(mockAnswersStore.values()).filter(a => a.question_id === questionId);

    const answers = await Promise.all(rawAnswers.map(async (ans) => {
      const ansAuthor = await this.findUserById(ans.author_id);
      const upvotesCount = Array.from(mockUpvotesStore.values()).filter(key => key.startsWith(`${ans.id}:`)).length;
      const isUpvoted = currentUserId ? mockUpvotesStore.has(`${ans.id}:${currentUserId}`) : false;
      const isBestAnswer = q.best_answer_id === ans.id;

      return {
        ...ans,
        author_name: ansAuthor ? ansAuthor.full_name : ans.author_name,
        author_avatar: ansAuthor ? ansAuthor.avatar_url : ans.author_avatar,
        author_is_mentor: ansAuthor ? ansAuthor.is_mentor : ans.author_is_mentor,
        upvotes_count: upvotesCount,
        is_upvoted: isUpvoted,
        is_best_answer: isBestAnswer,
      };
    }));

    answers.sort((a, b) => {
      if (a.is_best_answer) return -1;
      if (b.is_best_answer) return 1;
      if (b.upvotes_count !== a.upvotes_count) return b.upvotes_count - a.upvotes_count;
      return new Date(b.created_at) - new Date(a.created_at);
    });

    return {
      ...q,
      course_title: course ? course.title : q.course_id,
      course_platform: course ? course.platform : '',
      author_name: author ? author.full_name : q.author_name,
      author_avatar: author ? author.avatar_url : q.author_avatar,
      author_is_mentor: author ? author.is_mentor : q.author_is_mentor,
      answers
    };
  },

  async createQuestion({ courseId, authorId, title, content, tags = [] }) {
    const author = await this.findUserById(authorId);
    const newQuestion = {
      id: crypto.randomUUID(),
      course_id: courseId,
      author_id: authorId,
      author_name: author ? author.full_name : 'Anonymous',
      author_avatar: author ? author.avatar_url : '',
      author_is_mentor: author ? author.is_mentor : false,
      title,
      content,
      tags: Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()).filter(Boolean),
      best_answer_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    mockQuestionsStore.set(newQuestion.id, newQuestion);
    return newQuestion;
  },

  async updateQuestion(questionId, authorId, { title, content, tags }) {
    const q = mockQuestionsStore.get(questionId);
    if (!q) throw new Error('Question not found');
    const user = await this.findUserById(authorId);
    if (q.author_id !== authorId && user?.role !== 'admin') throw new Error('Unauthorized');

    if (title) q.title = title;
    if (content) q.content = content;
    if (tags) q.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()).filter(Boolean);
    q.updated_at = new Date().toISOString();

    mockQuestionsStore.set(questionId, q);
    return q;
  },

  async deleteQuestion(questionId, authorId) {
    const q = mockQuestionsStore.get(questionId);
    if (!q) throw new Error('Question not found');
    const user = await this.findUserById(authorId);
    if (q.author_id !== authorId && user?.role !== 'admin') throw new Error('Unauthorized');

    mockQuestionsStore.delete(questionId);
    return true;
  },

  async createAnswer({ questionId, authorId, content }) {
    const question = mockQuestionsStore.get(questionId);
    if (!question) throw new Error('Question not found');

    const author = await this.findUserById(authorId);
    const newAnswer = {
      id: crypto.randomUUID(),
      question_id: questionId,
      author_id: authorId,
      author_name: author ? author.full_name : 'Anonymous',
      author_avatar: author ? author.avatar_url : '',
      author_is_mentor: author ? author.is_mentor : false,
      content,
      upvotes_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    mockAnswersStore.set(newAnswer.id, newAnswer);

    if (question.author_id !== authorId) {
      await this.createNotification({
        userId: question.author_id,
        type: 'answer',
        message: `${author ? author.full_name : 'Someone'} answered your question: "${question.title.substring(0, 35)}..."`,
        questionId: questionId
      });
    }

    return newAnswer;
  },

  async updateAnswer(answerId, authorId, newContent) {
    const answer = mockAnswersStore.get(answerId);
    if (!answer) throw new Error('Answer not found');
    const user = await this.findUserById(authorId);
    if (answer.author_id !== authorId && user?.role !== 'admin') throw new Error('Unauthorized');

    answer.content = newContent;
    answer.updated_at = new Date().toISOString();
    mockAnswersStore.set(answerId, answer);
    return answer;
  },

  async deleteAnswer(answerId, authorId) {
    const answer = mockAnswersStore.get(answerId);
    if (!answer) throw new Error('Answer not found');
    const user = await this.findUserById(authorId);
    if (answer.author_id !== authorId && user?.role !== 'admin') throw new Error('Unauthorized');

    mockAnswersStore.delete(answerId);
    return true;
  },

  async markBestAnswer(questionId, authorId, answerId) {
    const question = mockQuestionsStore.get(questionId);
    if (!question) throw new Error('Question not found');
    const user = await this.findUserById(authorId);
    if (question.author_id !== authorId && user?.role !== 'admin') {
      throw new Error('Only the question author or admin can select the Best Answer');
    }

    const answer = mockAnswersStore.get(answerId);
    if (!answer) throw new Error('Answer not found');

    question.best_answer_id = answerId;
    question.updated_at = new Date().toISOString();
    mockQuestionsStore.set(questionId, question);

    if (answer.author_id !== authorId) {
      await this.createNotification({
        userId: answer.author_id,
        type: 'best_answer',
        message: `Your answer was marked as Best Answer on "${question.title.substring(0, 35)}..." 🌟`,
        questionId: questionId
      });
    }

    return true;
  },

  async toggleUpvoteAnswer(answerId, userId) {
    const key = `${answerId}:${userId}`;
    const answer = mockAnswersStore.get(answerId);
    if (!answer) throw new Error('Answer not found');

    const question = mockQuestionsStore.get(answer.question_id);
    let isUpvoted = false;

    if (mockUpvotesStore.has(key)) {
      mockUpvotesStore.delete(key);
      isUpvoted = false;
    } else {
      mockUpvotesStore.add(key);
      isUpvoted = true;

      if (answer.author_id !== userId) {
        const upvoter = await this.findUserById(userId);
        await this.createNotification({
          userId: answer.author_id,
          type: 'upvote',
          message: `${upvoter ? upvoter.full_name : 'A user'} upvoted your answer on "${question?.title.substring(0, 35) || 'a question'}".`,
          questionId: answer.question_id
        });
      }
    }

    const upvotesCount = Array.from(mockUpvotesStore.values()).filter(k => k.startsWith(`${answerId}:`)).length;
    return { isUpvoted, upvotesCount };
  },

  // --- MENTORSHIP REQUEST METHODS ---
  async createMentorshipRequest({ studentId, mentorId, courseId, message }) {
    const student = await this.findUserById(studentId);
    const mentor = await this.findUserById(mentorId);
    const course = mockCourseStore.get(courseId);

    const newReq = {
      id: crypto.randomUUID(),
      student_id: studentId,
      student_name: student ? student.full_name : 'Student',
      student_avatar: student ? student.avatar_url : '',
      mentor_id: mentorId,
      mentor_name: mentor ? mentor.full_name : 'Mentor',
      course_id: courseId,
      course_title: course ? course.title : courseId,
      message,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    mockMentorshipRequestsStore.set(newReq.id, newReq);

    await this.createNotification({
      userId: mentorId,
      type: 'mentorship_request',
      message: `${student ? student.full_name : 'A student'} requested mentorship for ${course ? course.title : 'a course'}!`,
      questionId: null
    });

    return newReq;
  },

  async getMentorshipRequests(userId) {
    const requests = Array.from(mockMentorshipRequestsStore.values()).filter(
      r => r.student_id === userId || r.mentor_id === userId
    );
    return requests.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async updateMentorshipStatus(requestId, userId, status) {
    const req = mockMentorshipRequestsStore.get(requestId);
    if (!req) throw new Error('Mentorship request not found');
    if (req.mentor_id !== userId && req.student_id !== userId) throw new Error('Unauthorized');

    req.status = status;
    mockMentorshipRequestsStore.set(requestId, req);
    return req;
  },

  // --- NOTIFICATIONS METHODS ---
  async getNotifications(userId) {
    const userNotifs = Array.from(mockNotificationsStore.values()).filter(n => n.user_id === userId);
    return userNotifs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async createNotification({ userId, type, message, questionId }) {
    const newNotif = {
      id: crypto.randomUUID(),
      user_id: userId,
      type,
      message,
      question_id: questionId,
      is_read: false,
      created_at: new Date().toISOString()
    };
    mockNotificationsStore.set(newNotif.id, newNotif);
    return newNotif;
  },

  async markNotificationRead(notifId, userId) {
    const notif = mockNotificationsStore.get(notifId);
    if (notif && notif.user_id === userId) {
      notif.is_read = true;
      mockNotificationsStore.set(notifId, notif);
    }
    return true;
  },

  async markAllNotificationsRead(userId) {
    for (const notif of mockNotificationsStore.values()) {
      if (notif.user_id === userId) {
        notif.is_read = true;
      }
    }
    return true;
  },

  // --- DASHBOARD STATS ---
  async getUserDashboardStats(userId) {
    const favorites = await this.getUserFavorites(userId);
    const progressList = await this.getUserCourseProgress(userId);
    
    const userQuestions = Array.from(mockQuestionsStore.values()).filter(q => q.author_id === userId);
    const userAnswers = Array.from(mockAnswersStore.values()).filter(a => a.author_id === userId);
    
    let totalUpvotesReceived = 0;
    userAnswers.forEach(ans => {
      const upvotes = Array.from(mockUpvotesStore.values()).filter(k => k.startsWith(`${ans.id}:`)).length;
      totalUpvotesReceived += upvotes;
    });

    const notStartedCount = progressList.filter(p => p.status === 'Not Started').length;
    const inProgressCount = progressList.filter(p => p.status === 'In Progress').length;
    const completedCount = progressList.filter(p => p.status === 'Completed').length;
    const totalTracked = progressList.length;

    const overallPercentage = totalTracked > 0 
      ? Math.round(((completedCount * 1.0 + inProgressCount * 0.5) / totalTracked) * 100) 
      : 0;

    return {
      stats: {
        favoritesCount: favorites.length,
        questionsCount: userQuestions.length,
        answersCount: userAnswers.length,
        upvotesReceived: totalUpvotesReceived,
        totalTracked,
        notStartedCount,
        inProgressCount,
        completedCount,
        overallPercentage
      },
      progressList
    };
  },

  // --- AI CAREER ASSISTANT RECOMMENDATION ENGINE ---
  async getAICareerRecommendations({ goals, targetRole, level }) {
    const textToMatch = `${goals || ''} ${targetRole || ''} ${level || ''}`.toLowerCase();

    let matchedCategory = 'Full Stack Development';
    let roadmapId = 'full-stack';

    if (textToMatch.includes('ai') || textToMatch.includes('machine learning') || textToMatch.includes('data science') || textToMatch.includes('python')) {
      matchedCategory = 'AI/ML';
      roadmapId = 'ai-ml';
    } else if (textToMatch.includes('cyber') || textToMatch.includes('security') || textToMatch.includes('hacker') || textToMatch.includes('network')) {
      matchedCategory = 'Cybersecurity';
      roadmapId = 'cybersecurity';
    } else if (textToMatch.includes('manager') || textToMatch.includes('project') || textToMatch.includes('leader') || textToMatch.includes('business') || textToMatch.includes('agile')) {
      matchedCategory = 'Management Skills';
      roadmapId = 'management';
    }

    const allCourses = Array.from(mockCourseStore.values());
    const categoryCourses = allCourses.filter(c => c.category === matchedCategory);
    
    // Sort courses by suitability simulation
    const recommendedCourses = (categoryCourses.length > 0 ? categoryCourses : allCourses).slice(0, 4).map(c => ({
      ...c,
      matchPercentage: Math.floor(Math.random() * 8) + 92,
      recommendationReason: `Strongly aligns with your focus in ${matchedCategory} (${c.level} level).`
    }));

    const allDiscussions = await this.getQuestions({ q: matchedCategory });
    const relatedDiscussions = allDiscussions.slice(0, 3);

    return {
      matchedCategory,
      recommendedRoadmapId: roadmapId,
      summary: `Based on your goal "${goals || targetRole || 'career growth'}", we recommend starting with the ${matchedCategory} pathway. This track prepares you with in-demand skills and hands-on projects.`,
      recommendedCourses,
      relatedDiscussions
    };
  }
};

export { supabase, pgPool };
