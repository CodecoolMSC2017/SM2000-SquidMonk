package com.codecool.web.dao.implementation;

import com.codecool.web.dao.ColumnDao;
import com.codecool.web.dao.ScheduleDao;
import com.codecool.web.dao.TaskDao;
import com.codecool.web.dao.UserDao;
import com.codecool.web.model.Task;
import org.junit.jupiter.api.Test;

import java.sql.Connection;
import java.sql.SQLException;

import static org.junit.jupiter.api.Assertions.*;

public class IntegrationTest extends AbstractTest {
    /*
    @Test
    void deleteSchedule() throws SQLException {
        try (Connection connection = getConnection()) {
            TaskAssignmentDaoImpl controlTable = new TaskAssignmentDaoImpl(connection);
            ScheduleDao scheduleDao = new ScheduleDaoImpl(connection);
            ColumnDao columnDao = new ColumnDaoImpl(connection);

            scheduleDao.deleteSchedule(1);
            assertNull(scheduleDao.findById(1));

            scheduleDao.deleteSchedule(7);
            assertFalse(controlTable.queryTaskPresent(30));
            assertNull(columnDao.findById(13));
            assertNull(scheduleDao.findById(7));
        }
    }

    @Test
    void deleteColumn() throws SQLException, ClassNotFoundException {
        resetDatabase();
        try (Connection connection = getConnection()) {
            TaskAssignmentDaoImpl controlTable = new TaskAssignmentDaoImpl(connection);
            ScheduleDao scheduleDao = new ScheduleDaoImpl(connection);
            ColumnDao columnDao = new ColumnDaoImpl(connection);
            TaskDao taskDao = new TaskDaoImpl(connection);

            columnDao.deleteColumn(11);
            assertNull(columnDao.findById(11));
            assertEquals(5, scheduleDao.findById(5).getId());
            assertFalse(controlTable.queryTaskPresent(4));
            assertFalse(controlTable.queryTaskPresent(5));
            assertFalse(controlTable.queryTaskPresent(6));
            assertFalse(controlTable.queryTaskPresent(7));
            assertFalse(controlTable.queryTaskPresent(8));
            assertEquals(5, taskDao.findById(4).getUserId());
        }
    }

    @Test
    void deleteTaskFromColumn() throws SQLException {
        try (Connection connection = getConnection()) {
            TaskAssignmentDaoImpl controlTable = new TaskAssignmentDaoImpl(connection);
            TaskDao taskDao = new TaskDaoImpl(connection);

            controlTable.removeTaskFromSchedule(1, 4);
            assertEquals(4, taskDao.findById(1).getUserId());
        }
    }

    @Test
    void deleteUser() throws SQLException {
        try (Connection connection = getConnection()) {
            TaskAssignmentDaoImpl controlTable = new TaskAssignmentDaoImpl(connection);
            ScheduleDao scheduleDao = new ScheduleDaoImpl(connection);
            ColumnDao columnDao = new ColumnDaoImpl(connection);
            TaskDao taskDao = new TaskDaoImpl(connection);
            UserDao userDao = new UserDaoImpl(connection);

            userDao.deleteUser(8);
            assertNull(userDao.findById(8));
            assertNull(scheduleDao.findById(8));
            assertNull(scheduleDao.findById(11));
            assertNull(scheduleDao.findById(14));

            userDao.deleteUser(4);
            assertNull(userDao.findById(4));
            assertNull(scheduleDao.findById(3));
            assertNull(scheduleDao.findById(4));
            assertNull(columnDao.findById(4));
            assertNull(columnDao.findById(6));
            assertNull(columnDao.findById(8));
            assertNull(taskDao.findById(1));
            assertNull(taskDao.findById(2));
            assertNull(taskDao.findById(3));
            assertFalse(controlTable.queryTaskPresent(1));
            assertFalse(controlTable.queryTaskPresent(2));
            assertFalse(controlTable.queryTaskPresent(3));
        }
    }
    /*
    @Test
    void addTaskEqualStartTimeAsEndTime() throws SQLException, ClassNotFoundException {
        resetDatabase();
        try (Connection connection = getConnection()) {
            TaskAssignmentDaoImpl controlTable = new TaskAssignmentDaoImpl(connection);
            TaskDao taskDao = new TaskDaoImpl(connection);

            taskDao.insertTask(7, "Csanád task 3", "Not much here"); // id:44
            Task newTask = taskDao.findById(44);
            Task oldTask = taskDao.findById(29);

            controlTable.insertTask(44, 19, 6, 12, 14);
            controlTable.insertTask(29, 19, 6, 10, 12);

            newTask = controlTable.queryTaskConnectionData(newTask, 0);
            oldTask = controlTable.queryTaskConnectionData(oldTask, 0);

            assertTrue(controlTable.queryTaskPresent(44));
            assertTrue(controlTable.queryTaskPresent(29));
            assertEquals(12, newTask.getColId());
            assertEquals(12, oldTask.getColId());
            assertEquals(12, newTask.getStart());
            assertEquals(12, oldTask.getEnd());
        }
    }

    @Test
    void addIntersectingTasks() throws SQLException, ClassNotFoundException {
        try (Connection connection = getConnection()) {
            TaskAssignmentDaoImpl controlTable = new TaskAssignmentDaoImpl(connection);
            TaskDao taskDao = new TaskDaoImpl(connection);

            taskDao.insertTask(7, "Csanád task 3", "Not much here"); // id:44
            taskDao.insertTask(7, "Csanád task 4", "Not much here"); // id:45
            taskDao.insertTask(7, "Csanád task 5", "Not much here"); // id:46
            taskDao.insertTask(7, "Csanád task 6", "Not much here"); // id:47

            controlTable.insertTask(29, 12, 6, 10, 12);
            assertThrows(SQLException.class, () -> controlTable.insertTask(44, 12, 6, 10, 12));
            assertThrows(SQLException.class, () -> controlTable.insertTask(45, 12, 6, 11, 11));
            assertThrows(SQLException.class, () -> controlTable.insertTask(46, 12, 6, 11, 12));
        }
    }

    @Test
    void addDifferentUserTaskToAnotherUsersTask() throws SQLException, ClassNotFoundException {
        resetDatabase();
        try (Connection connection = getConnection()) {
            TaskAssignmentDaoImpl controlTable = new TaskAssignmentDaoImpl(connection);
            TaskDao taskDao = new TaskDaoImpl(connection);

            taskDao.insertTask(7, "Csanád task 3", "Not much here"); // id:44

            assertThrows(SQLException.class, () -> controlTable.insertTask(44, 8, 4, 2, 4));
        }
    }*/

}
