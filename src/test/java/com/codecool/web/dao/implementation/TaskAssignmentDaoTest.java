package com.codecool.web.dao.implementation;

import com.codecool.web.model.Task;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ScriptUtils;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import static org.junit.jupiter.api.Assertions.*;

class TaskAssignmentDaoTest extends AbstractTest {
    /*
    @Test
    void queryTaskPresent() throws SQLException {
        try (Connection connection = getConnection()) {
            TaskAssignmentDaoImpl controlTable = new TaskAssignmentDaoImpl(connection);
            assertFalse(controlTable.queryTaskPresent(300));
            assertTrue(controlTable.queryTaskPresent(1));
        }
    }
    /*
    @Test
    void queryTaskConnectionData() throws SQLException, ClassNotFoundException {
        resetDatabase();
        try (Connection connection = getConnection()) {
            TaskAssignmentDaoImpl controlTable = new TaskAssignmentDaoImpl(connection);

            Task task = new Task(1, 4, "Csba Task 1", "Content");
            task = controlTable.queryTaskConnectionData(task, 0);

            assertEquals(4, task.getColId());
            assertEquals(4, task.getSchedId());
            assertEquals(10, task.getStart());
            assertEquals(14, task.getEnd());
        }
    }

    @Test
    void insertTask() throws SQLException {
        try (Connection connection = getConnection()) {
            TaskAssignmentDaoImpl controlTable = new TaskAssignmentDaoImpl(connection);

            controlTable.insertTask(29, 12, 6, 6, 12);

            Task task = new Task(29, 7, "Csanád Task 1", "Content");
            task = controlTable.queryTaskConnectionData(task, 0);

            assertEquals(12, task.getColId());
            assertEquals(6, task.getSchedId());
            assertEquals(6, task.getStart());
            assertEquals(12, task.getEnd());
        }
    }

    @Test
    void updateTaskSchedule() throws SQLException {
        try (Connection connection = getConnection()) {
            TaskAssignmentDaoImpl controlTable = new TaskAssignmentDaoImpl(connection);

            controlTable.updateTaskSchedule(30, 12, 6, 4, 5);

            Task task = new Task(30, 7, "Csanád Task 2", "Content");
            task = controlTable.queryTaskConnectionData(task, 0);

            assertEquals(12, task.getColId());
            assertEquals(6, task.getSchedId());
            assertEquals(4, task.getStart());
            assertEquals(5, task.getEnd());
        }
    }

    @Test
    void updateTaskTime() throws SQLException {
        try (Connection connection = getConnection()) {
            TaskAssignmentDaoImpl controlTable = new TaskAssignmentDaoImpl(connection);

            controlTable.updateTaskTime(30, 0, 4, 5);

            Task task = new Task(30, 7, "Csanád Task 2", "Content");
            task = controlTable.queryTaskConnectionData(task, 0);

            assertEquals(4, task.getStart());
            assertEquals(5, task.getEnd());
        }
    }

    @Test
    void updateTaskColumn() throws SQLException {
        try (Connection connection = getConnection()) {
            TaskAssignmentDaoImpl controlTable = new TaskAssignmentDaoImpl(connection);

            controlTable.updateTaskColumn(2, 0, 6, 4, 5);

            Task task = new Task(2, 4, "Csba Task 2", "Content");
            task = controlTable.queryTaskConnectionData(task, 0);

            assertEquals(6, task.getColId());
            assertEquals(4, task.getStart());
            assertEquals(5, task.getEnd());
        }
    }

    @Test
    void deleteTask() throws SQLException {
        try (Connection connection = getConnection()) {
            TaskAssignmentDaoImpl controlTable = new TaskAssignmentDaoImpl(connection);

            controlTable.removeTaskFromSchedule(30, 0);

            assertFalse(controlTable.queryTaskPresent(30));
        }
    }*/
}
