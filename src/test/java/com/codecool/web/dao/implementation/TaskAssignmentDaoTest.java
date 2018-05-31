package com.codecool.web.dao.implementation;

import com.codecool.web.dao.TaskAssignmentDao;
import com.codecool.web.model.Task;
import org.junit.jupiter.api.Test;

import java.sql.Connection;
import java.sql.SQLException;

import static org.junit.jupiter.api.Assertions.*;

class TaskAssignmentDaoTest extends AbstractTest {

    // execution order: 2 6 5 3 4 1 7

    @Test
        // 1
    void queryTaskPresent() throws SQLException {
        try (Connection connection = getConnection()) {
            TaskAssignmentDao controlTable = new TaskAssignmentDaoImpl(connection);

            assertFalse(controlTable.queryTaskPresent(300));
            assertTrue(controlTable.queryTaskPresent(1));
        }
    }

    @Test
        // 2
    void queryTaskConnectionData() throws SQLException {
        resetDatabase();
        try (Connection connection = getConnection()) {
            TaskAssignmentDao controlTable = new TaskAssignmentDaoImpl(connection);

            Task task = new Task(1, 4, "Clean toilet", "It really needs cleaning!");
            task = controlTable.queryTaskConnectionData(task, 4);

            assertEquals(4, task.getColId());
            assertEquals(4, task.getSchedId());
            assertEquals(10, task.getStart());
            assertEquals(14, task.getEnd());
        }
    }

    @Test
        // 3
    void insertTask() throws SQLException {
        try (Connection connection = getConnection()) {
            TaskAssignmentDao controlTable = new TaskAssignmentDaoImpl(connection);

            controlTable.insertTask(29, 12, 6, 6, 12);

            Task task = new Task(29, 7, "Csanád Task 1", "Content");
            task = controlTable.queryTaskConnectionData(task, 6);

            assertEquals(12, task.getColId());
            assertEquals(6, task.getSchedId());
            assertEquals(6, task.getStart());
            assertEquals(12, task.getEnd());
        }
    }

    @Test
        // 4
    void updateTaskSchedule() throws SQLException {
        try (Connection connection = getConnection()) {
            TaskAssignmentDao controlTable = new TaskAssignmentDaoImpl(connection);

            controlTable.updateTaskSchedule(30, 13, 7, 4, 5);

            Task task = new Task(30, 7, "Csanád Task 2", "Content");
            task = controlTable.queryTaskConnectionData(task, 7);

            assertEquals(13, task.getColId());
            assertEquals(7, task.getSchedId());
            assertEquals(4, task.getStart());
            assertEquals(5, task.getEnd());
        }
    }

    @Test
        // 5
    void updateTaskTime() throws SQLException {
        try (Connection connection = getConnection()) {
            TaskAssignmentDao controlTable = new TaskAssignmentDaoImpl(connection);

            controlTable.updateTaskTime(30, 7, 4, 5);

            Task task = new Task(30, 7, "Csanád Task 2", "Content");
            task = controlTable.queryTaskConnectionData(task, 7);

            assertEquals(4, task.getStart());
            assertEquals(5, task.getEnd());
        }
    }

    @Test
        // 6
    void updateTaskColumn() throws SQLException {
        try (Connection connection = getConnection()) {
            TaskAssignmentDao controlTable = new TaskAssignmentDaoImpl(connection);

            controlTable.updateTaskColumn(2, 5, 4, 4, 5);

            Task task = new Task(2, 4, "Csba Task 2", "Content");
            task = controlTable.queryTaskConnectionData(task, 4);

            assertEquals(5, task.getColId());
            assertEquals(4, task.getStart());
            assertEquals(5, task.getEnd());
        }
    }

    @Test
        // 7
    void deleteTask() throws SQLException {
        try (Connection connection = getConnection()) {
            TaskAssignmentDao controlTable = new TaskAssignmentDaoImpl(connection);

            controlTable.removeTaskFromSchedule(30, 7);

            assertFalse(controlTable.queryTaskPresent(30));
        }
    }
}
