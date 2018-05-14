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
    count INTEGER DEFAULT 0,
    is_public BOOLEAN DEFAULT false,
    FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT column_overflow CHECK (count < 8)
);

CREATE TABLE columns (
    id SERIAL PRIMARY KEY,
    schedule_id INTEGER,
    name TEXT NOT NULL,
    count INTEGER DEFAULT 0,
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

CREATE OR REPLACE FUNCTION check_task_occurrences()
RETURNS TRIGGER AS '
DECLARE
    schedule_count integer;
    task_count integer;
BEGIN
    SELECT COUNT(col_tsk.task_id) FROM col_tsk
    WHERE col_tsk.task_id = NEW.task_id
    AND col_tsk.schedule_id = NEW.schedule_id
    INTO schedule_count;

    SELECT COUNT(col_tsk.task_id) FROM col_tsk
    WHERE col_tsk.task_id = NEW.task_id
    AND col_tsk.col_id = NEW.col_id
    INTO task_count;

    IF schedule_count = 0 AND task_count = 0 THEN
		RETURN NEW;
	ELSE
  		RAISE EXCEPTION ''Trigger: task overflow'';
	END IF;
END;
'
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION increment_schedules_count()
RETURNS TRIGGER AS '
BEGIN
    UPDATE schedules SET count = count + 1
    WHERE schedules.id = NEW.schedule_id;
    RETURN NEW;
END;
'
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION increment_columns_count()
RETURNS TRIGGER AS '
BEGIN
    UPDATE columns SET count = count + 1
    WHERE columns.id = NEW.col_id;
    RETURN NEW;
END;
'
LANGUAGE 'plpgsql';

CREATE TRIGGER col_tsk_insert
    BEFORE INSERT ON col_tsk FOR EACH ROW
    EXECUTE PROCEDURE check_task_occurrences();

CREATE TRIGGER update_schedules_count
    AFTER INSERT ON columns FOR EACH ROW
    EXECUTE PROCEDURE increment_schedules_count();

CREATE TRIGGER update_columns_count
    AFTER INSERT ON col_tsk FOR EACH ROW
    EXECUTE PROCEDURE increment_columns_count();

INSERT INTO users (name, email, password, is_admin) VALUES
    ('Admin', 'admin@codecool.hu', 'qFy5HoRWvVMbZvcQfUi1Cw==', true), --1
    ('User', 'user@codecool.hu', 'qFy5HoRWvVMbZvcQfUi1Cw==', false), --2
    ('Alexandra Pekár', 'alexa@codecool.hu', 'A9BY34T5ftt4YLqJ0Ixolg==', false), --3
    ('Csizmadia Bálint', 'csba@codecool.hu', 'nbAINbUmfpZW3BhmIz/yng==', false), --4
    ('Ambrus Bence', 'bence@codecool.hu', 'RGljm6dBjK9OsSYMNhpyMg==', false), --5
    ('Faragó Bence', 'fbence@codecool.hu', 'RGljm6dBjK9OsSYMNhpyMg==', false), --6
    ('Hegedűs Csanád', 'csanad@codecool.hu', 'IfLiWlf8RbnxP3PbcxDlCA==', false), --7
    ('Teszt User', 'admin', 'qFy5HoRWvVMbZvcQfUi1Cw==', true); --8

INSERT INTO schedules (user_id, name, is_public) VALUES
    (2, 'Empty User sched', true), --1
    (3, 'Alexa sched #1', true), --2
    (4, 'Csba sched #1', false), --3
    (4, 'Csba sched #2', true), --4
    (5, 'Bence sched', false), --5
    (7, 'Csanád sched #1', false), --6
    (7, 'Csanád sched #2', false), --7
    (8, 'Teszt sched #1', true), --8
    (8, 'Teszt sched #2', false), --9
    (8, 'Teszt sched #3', true), --10
    (8, 'Teszt sched #4', false), --11
    (8, 'Teszt sched #5', true), --12
    (8, 'Teszt sched #6', false), --13
    (8, 'Teszt sched #7', true); --14

INSERT INTO columns (schedule_id, name) VALUES
    (2, 'Alexa Column 1'), --1
    (2, 'Alexa Column 2'), --2
    (2, 'Alexa Column 3'), --3
    (4, 'Csba Column 1'), --4
    (4, 'Csba Column 2'), --5
    (4, 'Csba Column 3'), --6
    (4, 'Csba Column 4'), --7
    (4, 'Csba Column 5'), --8
    (4, 'Csba Column 6'), --9
    (4, 'Csba Column 7'), --10
    (5, 'Bence Column 1'), --11
    (6, 'Csanád Column 1'), --12
    (7, 'Csanád Column 2'); --13

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
    (7, 'Csanád Task 1', 'Content'), --29
    (7, 'Csanád Task 2', 'Content'); --30

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
    (27, 11, 5, 23, 24),
    (30, 13, 7, 13, 15);
