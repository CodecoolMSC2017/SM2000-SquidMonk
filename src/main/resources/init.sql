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
    is_admin BOOLEAN DEFAULT false
);

CREATE TABLE schedules (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    name TEXT NOT NULL,
    is_public BOOLEAN DEFAULT false,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE columns (
    id SERIAL PRIMARY KEY,
    schedule_id INTEGER,
    name TEXT NOT NULL,
    FOREIGN KEY (schedule_id) REFERENCES schedules(id)
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
    CONSTRAINT start_time_greater_than_end_time CHECK (task_end > task_start),
    CONSTRAINT valid_start_time CHECK (task_start >= 0 AND task_start <= 23),
    CONSTRAINT valid_end_time CHECK (task_end >= 1 AND task_end <= 24)
);

CREATE OR REPLACE FUNCTION check_task_occurrences()
    RETURNS TRIGGER AS '
DECLARE
    schedule_count integer;
    column_count integer;
BEGIN
    SELECT COUNT(col_tsk.task_id) FROM col_tsk
    WHERE col_tsk.task_id = NEW.task_id
    AND col_tsk.schedule_id = NEW.schedule_id
    INTO schedule_count;

    SELECT COUNT(col_tsk.task_id) FROM col_tsk
    WHERE col_tsk.task_id = NEW.task_id
    AND col_tsk.col_id = NEW.col_id
    INTO column_count;

    IF schedule_count = 1 AND column_count = 1 THEN
		RETURN NEW;
	ELSE
  		RAISE EXCEPTION ''Task overflow'';
	END IF;
END;
'
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION check_schedules_capacity()
    RETURNS TRIGGER AS '
DECLARE
    count integer;
BEGIN
    SELECT COUNT(columns.id) FROM columns
    WHERE columns.schedule_id = NEW.schedule_id
    INTO count;

    IF count > 7 THEN
        RAISE EXCEPTION ''Capacity of this schedule is reached'';
    ELSE
        RETURN NEW;
    END IF;
END;
'
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION check_columns_capacity()
    RETURNS TRIGGER AS '
DECLARE
    r col_tsk%rowtype;
BEGIN
    FOR r IN SELECT * FROM col_tsk
    WHERE col_tsk.col_id = NEW.col_id
    LOOP
        IF NEW.task_start < r.task_end AND NEW.task_start > r.task_start THEN
            RAISE EXCEPTION ''Task start time intersects another task'';
        END IF;
        IF NEW.task_end < r.task_end AND NEW.task_end > r.task_start THEN
            RAISE EXCEPTION ''Task end time intersects another task'';
        END IF;
    END LOOP;
    RETURN NEW;
END;
'
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION delete_task_connections()
    RETURNS TRIGGER AS '
BEGIN
    DELETE FROM col_tsk WHERE col_tsk.task_id = OLD.id;
    RETURN OLD;
END;
'
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION delete_column_connections()
    RETURNS TRIGGER AS '
BEGIN
    DELETE FROM col_tsk WHERE col_tsk.col_id = OLD.id;
    RETURN OLD;
END;
'
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION delete_schedule_connections()
    RETURNS TRIGGER AS '
BEGIN
    DELETE FROM col_tsk WHERE schedule_id = OLD.id;
    DELETE FROM columns WHERE schedule_id = OLD.id;
    RETURN OLD;
END;
'
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION delete_user_connections()
    RETURNS TRIGGER AS '
BEGIN
    DELETE FROM schedules WHERE user_id = OLD.id;
    DELETE FROM tasks WHERE user_id = OLD.id;
    RETURN OLD;
END;
'
LANGUAGE 'plpgsql';

CREATE TRIGGER task_overflow_check
    AFTER INSERT OR UPDATE ON col_tsk FOR EACH ROW
    EXECUTE PROCEDURE check_task_occurrences();

CREATE TRIGGER column_capacity_check
    AFTER INSERT OR UPDATE ON col_tsk FOR EACH ROW
    EXECUTE PROCEDURE check_columns_capacity();

CREATE TRIGGER schedules_capacity_check
    AFTER INSERT OR UPDATE ON columns FOR EACH ROW
    EXECUTE PROCEDURE check_schedules_capacity();

CREATE TRIGGER task_delete
    BEFORE DELETE ON tasks FOR EACH ROW
    EXECUTE PROCEDURE delete_task_connections();

CREATE TRIGGER column_delete
    BEFORE DELETE ON columns FOR EACH ROW
    EXECUTE PROCEDURE delete_column_connections();

CREATE TRIGGER schedule_delete
    BEFORE DELETE ON schedules FOR EACH ROW
    EXECUTE PROCEDURE delete_schedule_connections();

CREATE TRIGGER user_delete
    BEFORE DELETE ON users FOR EACH ROW
    EXECUTE PROCEDURE delete_user_connections();

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
