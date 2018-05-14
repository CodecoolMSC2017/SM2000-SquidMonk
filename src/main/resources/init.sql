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
    count INTEGER NOT NULL,
    is_public BOOLEAN,
    FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT column_overflow CHECK (count < 8)
);

CREATE TABLE columns (
    id SERIAL PRIMARY KEY,
    schedule_id INTEGER,
    name TEXT NOT NULL,
    count INTEGER NOT NULL,
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
    ('Admin', 'admin@codecool.hu', 'qFy5HoRWvVMbZvcQfUi1Cw==', true), --1
    ('User', 'user@codecool.hu', 'qFy5HoRWvVMbZvcQfUi1Cw==', false), --2
    ('Alexandra Pekár', 'alexa@codecool.hu', 'A9BY34T5ftt4YLqJ0Ixolg==', false), --3
    ('Csizmadia Bálint', 'csba@codecool.hu', 'nbAINbUmfpZW3BhmIz/yng==', false), --4
    ('Ambrus Bence', 'bence@codecool.hu', 'RGljm6dBjK9OsSYMNhpyMg==', false), --5
    ('Faragó Bence', 'fbence@codecool.hu', 'RGljm6dBjK9OsSYMNhpyMg==', false), --6
    ('Hegedűs Csanád', 'csanad@codecool.hu', 'IfLiWlf8RbnxP3PbcxDlCA==', false); --7

INSERT INTO schedules (user_id, name, count, is_public) VALUES
    (2, 'Empty User sched', 0, true), --1
    (3, 'Alexa sched #1', 3, true), --2
    (4, 'Csba sched #1', 0, false), --3
    (4, 'Csba sched #2', 7, true), --4
    (5, 'Bence sched', 1, false), --5
    (7, 'Csanád sched', 1, false); --6

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
    (4, 'Csba Column 7', 0), --10
    (5, 'Bence Column 1', 24), --11
    (6, 'Csanád Column 1', 0); --12

INSERT INTO tasks (user_id, name, content) VALUES
    (4, 'Csba Task 1', 'Content'), --1
    (4, 'Csba Task 2', 'Content'), --2
    (4, 'Csba Task 3', 'Content'), --3
    (5, 'Bence Task 1', 'Content'), --4
    (5, 'Bence Task 2', 'Content'), --5
    (5, 'Bence Task 3', 'Content'), --6
    (5, 'Bence Task 4', 'Content'), --7
    (5, 'Bence Task 5', 'Content'), --8
    (5, 'Bence Task 6', 'Content'), --9
    (5, 'Bence Task 7', 'Content'), --10
    (5, 'Bence Task 8', 'Content'), --11
    (5, 'Bence Task 9', 'Content'), --12
    (5, 'Bence Task 10', 'Content'), --13
    (5, 'Bence Task 11', 'Content'), --14
    (5, 'Bence Task 12', 'Content'), --15
    (5, 'Bence Task 13', 'Content'), --16
    (5, 'Bence Task 14', 'Content'), --17
    (5, 'Bence Task 15', 'Content'), --18
    (5, 'Bence Task 16', 'Content'), --19
    (5, 'Bence Task 17', 'Content'), --20
    (5, 'Bence Task 18', 'Content'), --21
    (5, 'Bence Task 19', 'Content'), --22
    (5, 'Bence Task 20', 'Content'), --23
    (5, 'Bence Task 21', 'Content'), --24
    (5, 'Bence Task 22', 'Content'), --25
    (5, 'Bence Task 23', 'Content'), --26
    (5, 'Bence Task 24', 'Content'), --27
    (6, 'FBence Task 1', ''), --28
    (6, 'Csanád Task 1', 'Content'); --29

INSERT INTO col_tsk (task_id, col_id, schedule_id, task_start, task_end) VALUES
    (1, 4, 4, 10, 14),
    (2, 5, 4, 8, 10),
    (3, 6, 4, 7, 18),
    (4, 11, 5, 0, 1),
    (5, 11, 5, 1, 2),
    (6, 11, 5, 2, 3),
    (7, 11, 5, 3, 4),
    (8, 11, 5, 4, 5),
    (9, 11, 5, 5, 6),
    (10, 11, 5, 6, 7),
    (11, 11, 5, 7, 8),
    (12, 11, 5, 8, 9),
    (13, 11, 5, 9, 10),
    (14, 11, 5, 10, 11),
    (15, 11, 5, 11, 12),
    (16, 11, 5, 12, 13),
    (17, 11, 5, 13, 14),
    (18, 11, 5, 14, 15),
    (19, 11, 5, 15, 16),
    (20, 11, 5, 16, 17),
    (21, 11, 5, 17, 18),
    (22, 11, 5, 18, 19),
    (23, 11, 5, 19, 20),
    (24, 11, 5, 20, 21),
    (25, 11, 5, 21, 22),
    (26, 11, 5, 22, 23),
    (27, 11, 5, 23, 24);