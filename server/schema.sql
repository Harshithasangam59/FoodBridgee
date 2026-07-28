-- PathPilot PostgreSQL / Supabase Database Schema

-- Enable UUID extension if supported
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'student', -- 'student', 'mentor', 'admin'
    is_mentor BOOLEAN DEFAULT FALSE,
    avatar_url TEXT,
    bio TEXT DEFAULT '',
    skills TEXT[] DEFAULT '{}',
    interests TEXT[] DEFAULT '{}',
    github_url TEXT DEFAULT '',
    linkedin_url TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Courses Table
CREATE TABLE IF NOT EXISTS courses (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    platform VARCHAR(100) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    price_type VARCHAR(50) NOT NULL,
    level VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL,
    link TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);

-- User Favorites Table
CREATE TABLE IF NOT EXISTS user_favorites (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_id VARCHAR(100) REFERENCES courses(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, course_id)
);

-- User Course Progress Table
CREATE TABLE IF NOT EXISTS user_course_progress (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_id VARCHAR(100) REFERENCES courses(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'In Progress', -- 'Not Started', 'In Progress', 'Completed'
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, course_id)
);

-- Questions / Discussions Table
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id VARCHAR(100) REFERENCES courses(id) ON DELETE CASCADE,
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    best_answer_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_questions_course ON questions(course_id);
CREATE INDEX IF NOT EXISTS idx_questions_author ON questions(author_id);

-- Answers Table
CREATE TABLE IF NOT EXISTS answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_answers_question ON answers(question_id);

-- Answer Upvotes Table
CREATE TABLE IF NOT EXISTS answer_upvotes (
    answer_id UUID REFERENCES answers(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (answer_id, user_id)
);

-- Mentorship Requests Table
CREATE TABLE IF NOT EXISTS mentorship_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    mentor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_id VARCHAR(100) REFERENCES courses(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'accepted', 'declined'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'answer', 'upvote', 'best_answer', 'mentorship_request'
    message TEXT NOT NULL,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
