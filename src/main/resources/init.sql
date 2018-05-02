DROP TABLE IF EXISTS col_tsk;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS columns;
DROP TABLE IF EXISTS schedules;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    is_admin BOOLEAN NOT NULL
);

CREATE TABLE schedules (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    name TEXT NOT NULL,
    count INTEGER,
    is_public BOOLEAN,
    FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT count_less_than_seven CHECK (count < 8)
);

CREATE TABLE columns (
    id SERIAL PRIMARY KEY,
    schedule_id INTEGER,
    name TEXT NOT NULL,
    count INTEGER,
    FOREIGN KEY (schedule_id) REFERENCES schedules(id),
    CONSTRAINT task_less_than_twentyfive CHECK (count < 25)
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    name TEXT NOT NULL,
    content TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE col_tsk (
    col_id INTEGER,
    task_id INTEGER,
    schedule_id INTEGER,
    task_start INTEGER,
    task_end INTEGER,
	PRIMARY KEY (col_id, task_id, schedule_id),
    FOREIGN KEY (col_id) REFERENCES columns(id),
    FOREIGN KEY (task_id) REFERENCES tasks(id),
    FOREIGN KEY (schedule_id) REFERENCES schedules(id)
);

INSERT INTO users (name, email, password, is_admin) VALUES
    ('Admin', 'admin@codecool.hu', 'admin', true),
    ('User', 'user@codecool.hu', 'admin', false);

INSERT INTO schedules (user_id, name, count, is_public) VALUES
    (1, 'Schedule 1', 6, true),
    (2, 'Schedule 2', 7, true),
    (2, 'Schedule 3', 6, true);

INSERT INTO columns (schedule_id, name, count) VALUES
    (1, 'Column 1', 20),
    (1, 'Column 2', 18),
    (1, 'Column 3', 15),
    (1, 'Column 4', 21),
    (1, 'Column 5', 24),
    (1, 'Column 6', 22),
    (2, 'Column 1', 11),
    (2, 'Column 2', 9),
    (2, 'Column 3', 21),
    (2, 'Column 4', 15),
    (2, 'Column 5', 13),
    (2, 'Column 6', 19),
    (2, 'Column 7', 20),
    (3, 'Column 1', 10),
    (3, 'Column 2', 11),
    (3, 'Column 3', 12),
    (3, 'Column 4', 13),
    (3, 'Column 5', 14),
    (3, 'Column 6', 15),
    (3, 'Column 7', 16),
    (3, 'Column 8', 17);

INSERT INTO tasks (user_id, name, content) VALUES
    (1, 'Task 1', 'Content'),
    (1, 'Task 2', 'Content'),
    (1, 'Task 3', 'Content'),
    (1, 'Task 4', 'Content'),
    (2, 'Task 1', 'Content'),
    (2, 'Task 2', 'Content'),
    (2, 'Task 3', 'Content'),
    (2, 'Task 4', 'Content');

INSERT INTO col_tsk (col_id, task_id, schedule_id, task_start, task_end) VALUES
    (1, 1, 1, 1, 1),
    (1, 2, 1, 2, 1),
    (2, 1, 2, 1, 2),
    (1, 1, 2, 5, 7);