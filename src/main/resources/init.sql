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
    CONSTRAINT end_time_greater_than_start_time CHECK (task_end > task_start),
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
        END;'
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
        END;'
    LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION check_task_overlap()
    RETURNS TRIGGER AS '
        DECLARE
            r col_tsk%rowtype;
        BEGIN
            FOR r IN SELECT * FROM col_tsk
            WHERE col_tsk.col_id = NEW.col_id
            LOOP
                IF NEW.task_id = r.task_id AND NEW.col_id = r.col_id AND NEW.schedule_id = r.schedule_id THEN
                    CONTINUE;
                ELSIF NEW.task_start < r.task_end AND NEW.task_start >= r.task_start THEN
                    RAISE EXCEPTION ''Task start time intersects another task'';
                ELSIF NEW.task_end <= r.task_end AND NEW.task_end > r.task_start THEN
                    RAISE EXCEPTION ''Task end time intersects another task'';
                ELSIF NEW.task_start <= r.task_start AND NEW.task_end >= r.task_end THEN
                    RAISE EXCEPTION ''Another task intersects this task'';
                END IF;
            END LOOP;
            RETURN NEW;
        END;'
    LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION delete_task_connections()
    RETURNS TRIGGER AS '
        BEGIN
            DELETE FROM col_tsk WHERE col_tsk.task_id = OLD.id;
            RETURN OLD;
        END;'
    LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION delete_column_connections()
    RETURNS TRIGGER AS '
        BEGIN
            DELETE FROM col_tsk WHERE col_tsk.col_id = OLD.id;
            RETURN OLD;
        END;'
    LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION delete_schedule_connections()
    RETURNS TRIGGER AS '
        BEGIN
            DELETE FROM col_tsk WHERE schedule_id = OLD.id;
            DELETE FROM columns WHERE schedule_id = OLD.id;
            RETURN OLD;
        END;'
    LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION delete_user_connections()
    RETURNS TRIGGER AS '
        BEGIN
            DELETE FROM schedules WHERE user_id = OLD.id;
            DELETE FROM tasks WHERE user_id = OLD.id;
            RETURN OLD;
        END;'
    LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION check_task_insert_into_own_schedule()
    RETURNS TRIGGER AS '
        DECLARE
            schedule schedules%rowtype;
            task tasks%rowtype;
        BEGIN
            SELECT * FROM schedules WHERE schedules.id = NEW.schedule_id INTO schedule;
            SELECT * FROM tasks WHERE tasks.id = NEW.task_id INTO task;

            IF schedule.user_id <> task.user_id THEN
                RAISE EXCEPTION ''Task can only be assigned to own schedule'';
            END IF;
            RETURN NEW;
        END;'
    LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION check_column_schedule_id_match()
    RETURNS TRIGGER AS '
        DECLARE
            col columns%rowtype;
        BEGIN
            SELECT * FROM columns WHERE columns.id = NEW.col_id INTO col;

            IF col.schedule_id <> NEW.schedule_id THEN
                RAISE EXCEPTION ''Schedule-column mismatch'';
            END IF;
            RETURN NEW;
        END;'
    LANGUAGE 'plpgsql';

CREATE TRIGGER task_overflow_check
    AFTER INSERT OR UPDATE ON col_tsk FOR EACH ROW
    EXECUTE PROCEDURE check_task_occurrences();

CREATE TRIGGER column_integrity_check
    AFTER INSERT OR UPDATE ON col_tsk FOR EACH ROW
    EXECUTE PROCEDURE check_task_overlap();

CREATE TRIGGER task_insert_into_own_schedule_check
    AFTER INSERT OR UPDATE ON col_tsk FOR EACH ROW
    EXECUTE PROCEDURE check_task_insert_into_own_schedule();

CREATE TRIGGER column_schedule_id_match_check
    AFTER INSERT OR UPDATE ON col_tsk FOR EACH ROW
    EXECUTE PROCEDURE check_column_schedule_id_match();

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
    ('Teszt User', 'admin', 'qFy5HoRWvVMbZvcQfUi1Cw==', true), --8
    ('Rainbow', 'rainbow', 'qs+WH1dNJMPvNBua49gF5g==', true); --9

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
    (8, 'Teszt sched #7', true), --14
    (9, 'Rainbow schedule', true); --15

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
    (7, 'Csanád Column 2'), --13
    (15, 'Rainbow #1'), --14
    (15, 'Rainbow #2'), --15
    (15, 'Rainbow #3'), --16
    (15, 'Rainbow #4'), --17
    (15, 'Rainbow #5'), --18
    (15, 'Rainbow #6'), --19
    (15, 'Rainbow #7'); --20

INSERT INTO tasks (user_id, name, content) VALUES
    (4, 'Clean toilet', 'It really needs cleaning!'), --1
    (4, 'Take out the trash', 'So much....'), --2
    (4, 'Level up my paladin to 100', 'Nothing less would suffice!'), --3
    (5, 'Get laid (difficult)', '(Not really)'), --4
    (5, 'Learn to sing', '(Now this is difficult)'), --5
    (5, 'Dress up', ''), --6
    (5, 'Buy a car', ''), --7
    (5, 'Sell unnecessary stuff', ''), --8
    (5, 'Clean out room', ''), --9
    (5, 'Learn PHP', ''), --10
    (5, 'Learn german', ''), --11
    (5, 'Finish schedule master', ''), --12
    (5, 'Make burndown chart', ''), --13
    (5, 'Go shopping', ''), --14
    (5, 'Bake a cake', ''), --15
    (5, 'Eat healthy', ''), --16
    (5, 'Attend meeting', ''), --17
    (5, 'Give away money', ''), --18
    (5, 'Travel to China', ''), --19
    (5, 'Call mom', ''), --20
    (5, 'Exercise', ''), --21
    (5, 'Go to the gym', ''), --22
    (5, 'Make bed', ''), --23
    (5, 'Wash dishes', ''), --24
    (5, 'Vacuum', ''), --25
    (5, 'Sweep', ''), --26
    (5, 'Mop', ''), --27
    (6, 'Dust all surfaces', ''), --28
    (7, 'Scrub sink', ''), --29
    (7, 'Clean oven', ''), --30
    (8, 'Wash bedding', ''), --31
    (8, 'Clean windows', 'Have wet wipes ready!'), --32
    (8, 'Reformat computer', 'Do not forget: format c: :)'), --33
    (8, 'Refactor old codes', ''), --34
    (8, 'Hand in assignments', ''), --35
    (8, 'Shovel snow away', ''), --36
    (8, 'Cut grass', ''), --37
    (8, 'Take a shower', ''), --38
    (8, 'Wash pillows', ''), --39
    (8, 'Wipe light switches', ''), --40
    (8, 'Clean closets', ''), --41
    (8, 'Deal with the mail', 'Got one from Grandma yesterday. Could be important!'), --42
    (8, 'Read the news', 'Sooo much to catch up with'), --43
    (4, 'Do laundry', 'Really gotta do it'), --44
    (9, 'Rainbow', 'Rainbow'), --45
    (9, 'Rainbow', 'Rainbow'), --46
    (9, 'Rainbow', 'Rainbow'), --47
    (9, 'Rainbow', 'Rainbow'), --48
    (9, 'Rainbow', 'Rainbow'), --49
    (9, 'Rainbow', 'Rainbow'), --50
    (9, 'Rainbow', 'Rainbow'), --51
    (9, 'Rainbow', 'Rainbow'), --52
    (9, 'Rainbow', 'Rainbow'), --53
    (9, 'Rainbow', 'Rainbow'), --54
    (9, 'Rainbow', 'Rainbow'), --55
    (9, 'Rainbow', 'Rainbow'), --56
    (9, 'Rainbow', 'Rainbow'), --57
    (9, 'Rainbow', 'Rainbow'), --58
    (9, 'Rainbow', 'Rainbow'), --59
    (9, 'Rainbow', 'Rainbow'), --60
    (9, 'Rainbow', 'Rainbow'), --61
    (9, 'Rainbow', 'Rainbow'), --62
    (9, 'Rainbow', 'Rainbow'), --63
    (9, 'Rainbow', 'Rainbow'), --64
    (9, 'Rainbow', 'Rainbow'), --65
    (9, 'Rainbow', 'Rainbow'), --66
    (9, 'Rainbow', 'Rainbow'), --67
    (9, 'Rainbow', 'Rainbow'), --68
    (9, 'Rainbow', 'Rainbow'), --69
    (9, 'Rainbow', 'Rainbow'), --70
    (9, 'Rainbow', 'Rainbow'), --71
    (9, 'Rainbow', 'Rainbow'), --72
    (9, 'Rainbow', 'Rainbow'), --73
    (9, 'Rainbow', 'Rainbow'), --74
    (9, 'Rainbow', 'Rainbow'), --75
    (9, 'Rainbow', 'Rainbow'), --76
    (9, 'Rainbow', 'Rainbow'), --77
    (9, 'Rainbow', 'Rainbow'), --78
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'), --145
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'),
    (9, 'Rainbow', 'Rainbow'), --195
    (9, 'Rainbow', 'Rainbow'), --196
    (9, 'Rainbow', 'Rainbow'), --197
    (9, 'Rainbow', 'Rainbow'), --198
    (9, 'Rainbow', 'Rainbow'), --199
    (9, 'Rainbow', 'Rainbow'), --200
    (9, 'Rainbow', 'Rainbow'), --201
    (9, 'Rainbow', 'Rainbow'), --202
    (9, 'Rainbow', 'Rainbow'), --203
    (9, 'Rainbow', 'Rainbow'), --204
    (9, 'Rainbow', 'Rainbow'), --205
    (9, 'Rainbow', 'Rainbow'), --206
    (9, 'Rainbow', 'Rainbow'), --207
    (9, 'Rainbow', 'Rainbow'), --208
    (9, 'Rainbow', 'Rainbow'), --209
    (9, 'Rainbow', 'Rainbow'), --210
    (9, 'Rainbow', 'Rainbow'), --211
    (9, 'Rainbow', 'Rainbow'); --212

INSERT INTO col_tsk (task_id, col_id, schedule_id, task_start, task_end) VALUES
    (1, 4, 4, 10, 14),
    (2, 5, 4, 8, 10),
    (3, 6, 4, 0, 24),
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
    (30, 13, 7, 13, 15),
    (44, 4, 4, 9, 10),

    (45, 14, 15, 0, 1),
    (46, 14, 15, 1, 2),
    (47, 14, 15, 2, 3),
    (48, 14, 15, 3, 4),
    (49, 14, 15, 4, 5),
    (50, 14, 15, 5, 6),
    (51, 14, 15, 6, 7),
    (52, 14, 15, 7, 8),
    (53, 14, 15, 8, 9),
    (54, 14, 15, 9, 10),
    (55, 14, 15, 10, 11),
    (56, 14, 15, 11, 12),
    (57, 14, 15, 12, 13),
    (58, 14, 15, 13, 14),
    (59, 14, 15, 14, 15),
    (60, 14, 15, 15, 16),
    (61, 14, 15, 16, 17),
    (62, 14, 15, 17, 18),
    (63, 14, 15, 18, 19),
    (64, 14, 15, 19, 20),
    (65, 14, 15, 20, 21),
    (66, 14, 15, 21, 22),
    (67, 14, 15, 22, 23),
    (68, 14, 15, 23, 24),
    (69, 15, 15, 0, 1),
    (70, 15, 15, 1, 2),
    (71, 15, 15, 2, 3),
    (72, 15, 15, 3, 4),
    (73, 15, 15, 4, 5),
    (74, 15, 15, 5, 6),
    (75, 15, 15, 6, 7),
    (76, 15, 15, 7, 8),
    (77, 15, 15, 8, 9),
    (78, 15, 15, 9, 10),
    (79, 15, 15, 10, 11),
    (80, 15, 15, 11, 12),
    (81, 15, 15, 12, 13),
    (82, 15, 15, 13, 14),
    (83, 15, 15, 14, 15),
    (84, 15, 15, 15, 16),
    (85, 15, 15, 16, 17),
    (86, 15, 15, 17, 18),
    (87, 15, 15, 18, 19),
    (88, 15, 15, 19, 20),
    (89, 15, 15, 20, 21),
    (90, 15, 15, 21, 22),
    (91, 15, 15, 22, 23),
    (92, 15, 15, 23, 24),
    (93, 16, 15, 0, 1),
    (94, 16, 15, 1, 2),
    (95, 16, 15, 2, 3),
    (96, 16, 15, 3, 4),
    (97, 16, 15, 4, 5),
    (98, 16, 15, 5, 6),
    (99, 16, 15, 6, 7),
    (100, 16, 15, 7, 8),
    (101, 16, 15, 8, 9),
    (102, 16, 15, 9, 10),
    (103, 16, 15, 10, 11),
    (104, 16, 15, 11, 12),
    (105, 16, 15, 12, 13),
    (106, 16, 15, 13, 14),
    (107, 16, 15, 14, 15),
    (108, 16, 15, 15, 16),
    (109, 16, 15, 16, 17),
    (110, 16, 15, 17, 18),
    (111, 16, 15, 18, 19),
    (112, 16, 15, 19, 20),
    (113, 16, 15, 20, 21),
    (114, 16, 15, 21, 22),
    (115, 16, 15, 22, 23),
    (116, 16, 15, 23, 24),
    (117, 17, 15, 0, 1),
    (118, 17, 15, 1, 2),
    (119, 17, 15, 2, 3),
    (120, 17, 15, 3, 4),
    (121, 17, 15, 4, 5),
    (122, 17, 15, 5, 6),
    (123, 17, 15, 6, 7),
    (124, 17, 15, 7, 8),
    (125, 17, 15, 8, 9),
    (126, 17, 15, 9, 10),
    (127, 17, 15, 10, 11),
    (128, 17, 15, 11, 12),
    (129, 17, 15, 12, 13),
    (130, 17, 15, 13, 14),
    (131, 17, 15, 14, 15),
    (132, 17, 15, 15, 16),
    (133, 17, 15, 16, 17),
    (134, 17, 15, 17, 18),
    (135, 17, 15, 18, 19),
    (136, 17, 15, 19, 20),
    (137, 17, 15, 20, 21),
    (138, 17, 15, 21, 22),
    (139, 17, 15, 22, 23),
    (140, 17, 15, 23, 24),
    (141, 18, 15, 0, 1),
    (142, 18, 15, 1, 2),
    (143, 18, 15, 2, 3),
    (144, 18, 15, 3, 4),
    (145, 18, 15, 4, 5),
    (146, 18, 15, 5, 6),
    (147, 18, 15, 6, 7),
    (148, 18, 15, 7, 8),
    (149, 18, 15, 8, 9),
    (150, 18, 15, 9, 10),
    (151, 18, 15, 10, 11),
    (152, 18, 15, 11, 12),
    (153, 18, 15, 12, 13),
    (154, 18, 15, 13, 14),
    (155, 18, 15, 14, 15),
    (156, 18, 15, 15, 16),
    (157, 18, 15, 16, 17),
    (158, 18, 15, 17, 18),
    (159, 18, 15, 18, 19),
    (160, 18, 15, 19, 20),
    (161, 18, 15, 20, 21),
    (162, 18, 15, 21, 22),
    (163, 18, 15, 22, 23),
    (164, 18, 15, 23, 24),
    (165, 19, 15, 0, 1),
    (166, 19, 15, 1, 2),
    (167, 19, 15, 2, 3),
    (168, 19, 15, 3, 4),
    (169, 19, 15, 4, 5),
    (170, 19, 15, 5, 6),
    (171, 19, 15, 6, 7),
    (172, 19, 15, 7, 8),
    (173, 19, 15, 8, 9),
    (174, 19, 15, 9, 10),
    (175, 19, 15, 10, 11),
    (176, 19, 15, 11, 12),
    (177, 19, 15, 12, 13),
    (178, 19, 15, 13, 14),
    (179, 19, 15, 14, 15),
    (180, 19, 15, 15, 16),
    (181, 19, 15, 16, 17),
    (182, 19, 15, 17, 18),
    (183, 19, 15, 18, 19),
    (184, 19, 15, 19, 20),
    (185, 19, 15, 20, 21),
    (186, 19, 15, 21, 22),
    (187, 19, 15, 22, 23),
    (188, 19, 15, 23, 24),
    (189, 20, 15, 0, 1),
    (190, 20, 15, 1, 2),
    (191, 20, 15, 2, 3),
    (192, 20, 15, 3, 4),
    (193, 20, 15, 4, 5),
    (194, 20, 15, 5, 6),
    (195, 20, 15, 6, 7),
    (196, 20, 15, 7, 8),
    (197, 20, 15, 8, 9),
    (198, 20, 15, 9, 10),
    (199, 20, 15, 10, 11),
    (200, 20, 15, 11, 12),
    (201, 20, 15, 12, 13),
    (202, 20, 15, 13, 14),
    (203, 20, 15, 14, 15),
    (204, 20, 15, 15, 16),
    (205, 20, 15, 16, 17),
    (206, 20, 15, 17, 18),
    (207, 20, 15, 18, 19),
    (208, 20, 15, 19, 20),
    (209, 20, 15, 20, 21),
    (210, 20, 15, 21, 22),
    (211, 20, 15, 22, 23),
    (212, 20, 15, 23, 24);
