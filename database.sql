-- Create 'users' table
CREATE TABLE users (
    user_id VARCHAR(255) UNIQUE,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(255) UNIQUE,
    birthday DATETIME
);

-- Create 'projects' table
CREATE TABLE projects (
    name VARCHAR(255),
    description TEXT,
    owner_id VARCHAR(255),
    enrollment_id VARCHAR(255) UNIQUE
);

-- Create 'tasks' table
CREATE TABLE tasks (
    name VARCHAR(255),
    short_description TEXT,
    status VARCHAR(255),
    event_id VARCHAR(255),
    owner_id VARCHAR(255),
    project_id VARCHAR(255),
    priority_range VARCHAR(255)
);

-- Create 'events' table
CREATE TABLE events (
    name VARCHAR(255),
    short_description TEXT,
    starting_date DATETIME,
    ending_date DATETIME,
    owner_id VARCHAR(255),
    priority_range VARCHAR(255)
);

-- Create 'comments' table
CREATE TABLE comments (
    user_id VARCHAR(255),
    task_id VARCHAR(255),
    content TEXT
);

-- Create 'joined_projects' table
CREATE TABLE joined_projects (
    owner_id VARCHAR(255),
    user_id VARCHAR(255),
    project VARCHAR(255),
    FOREIGN KEY (project) REFERENCES projects(enrollment_id)
);
