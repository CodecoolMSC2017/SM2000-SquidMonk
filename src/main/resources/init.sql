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