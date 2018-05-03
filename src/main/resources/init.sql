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
    CONSTRAINT column_overflow CHECK (count < 8)
);

CREATE TABLE columns (
    id SERIAL PRIMARY KEY,
    schedule_id INTEGER,
    name TEXT NOT NULL,
    count INTEGER,
    FOREIGN KEY (schedule_id) REFERENCES schedules(id),
    CONSTRAINT task_overflow CHECK (count < 25)
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    name TEXT NOT NULL,
    content TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE col_tsk (
    task_id INTEGER,
    col_id INTEGER,
    schedule_id INTEGER,
    task_start INTEGER,
    task_end INTEGER,
	PRIMARY KEY (col_id, task_id, schedule_id),
    FOREIGN KEY (col_id) REFERENCES columns(id),
    FOREIGN KEY (task_id) REFERENCES tasks(id),
    FOREIGN KEY (schedule_id) REFERENCES schedules(id),
    CONSTRAINT incorrect_start_time CHECK (task_end > task_start)
);

INSERT INTO users (name, email, password, is_admin) VALUES
    ('Admin', 'admin@codecool.hu', 'admin', true), --1
    ('User', 'user@codecool.hu', 'admin', false), --2
    ('Alexandra Pekár', 'alexa@codecool.hu', 'alexa', false), --3
    ('Csizmadia Bálint', 'csba@codecool.hu', 'csba', false); --4

INSERT INTO schedules (user_id, name, count, is_public) VALUES
    (2, 'Empty User sched', 0, true), --1
    (3, 'Alexa sched #1', 3, true), --2
    (4, 'Csba sched #1', 0, true), --3
    (4, 'Csba sched #2', 7, true); --4

INSERT INTO columns (schedule_id, name, count) VALUES
    (2, 'Alexa Column 1', 0), --1
    (2, 'Alexa Column 2', 0), --2
    (2, 'Alexa Column 3', 0), --3
    (4, 'Csba Column 1', 1), --4
    (4, 'Csba Column 2', 1), --5
    (4, 'Csba Column 3', 1), --6
    (4, 'Csba Column 4', 0), --7
    (4, 'Csba Column 5', 0), --8
    (4, 'Csba Column 6', 0), --9
    (4, 'Csba Column 7', 0); --10

INSERT INTO tasks (user_id, name, content) VALUES
    (4, 'Csba Task 1', 'Content'), --1
    (4, 'Csba Task 2', 'Content'), --2
    (4, 'Csba Task 3', 'Content'); --3

INSERT INTO col_tsk (task_id, col_id, schedule_id, task_start, task_end) VALUES
    (1, 4, 4, 10, 14),
    (2, 5, 4, 8, 10),
    (3, 6, 4, 7, 18);