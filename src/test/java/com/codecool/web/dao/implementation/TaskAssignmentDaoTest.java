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

class TaskAssignmentDaoTest {

    String dbUrl = "jdbc:postgresql://localhost:5432/sm2000_test";

    @BeforeEach
    void setUp() {
    }

    /*@Test
    void queryTaskPresent() throws SQLException {
        try (Connection con = DriverManager.getConnection(dbUrl, "test", "test")) {
            TaskAssignmentDaoImpl controlTable = new TaskAssignmentDaoImpl(con);
            assertFalse(controlTable.queryTaskPresent(300));
            assertTrue(controlTable.queryTaskPresent(1));
        }
    }

    @Test
    void queryTaskConnectionData() throws SQLException, ClassNotFoundException {
        resetDb();
        try (Connection con = DriverManager.getConnection(dbUrl, "test", "test")) {
            TaskAssignmentDaoImpl controlTable = new TaskAssignmentDaoImpl(con);

            Task task = new Task(1, 4, "Csba Task 1", "Content");
            task = controlTable.queryTaskConnectionData(task);

            assertEquals(4, task.getColId());
            assertEquals(4, task.getSchedId());
            assertEquals(10, task.getStart());
            assertEquals(14, task.getEnd());
        }
    }

    @Test
    void insertTask() throws SQLException {
        try (Connection con = DriverManager.getConnection(dbUrl, "test", "test")) {
            TaskAssignmentDaoImpl controlTable = new TaskAssignmentDaoImpl(con);

            controlTable.insertTask(29, 12, 6, 6, 12);

            Task task = new Task(29, 7, "Csanád Task 1", "Content");
            task = controlTable.queryTaskConnectionData(task);

            assertEquals(12, task.getColId());
            assertEquals(6, task.getSchedId());
            assertEquals(6, task.getStart());
            assertEquals(12, task.getEnd());
        }
    }

    @Test
    void updateTaskSchedule() throws SQLException {
        try (Connection con = DriverManager.getConnection(dbUrl, "test", "test")) {
            TaskAssignmentDaoImpl controlTable = new TaskAssignmentDaoImpl(con);

            controlTable.updateTaskSchedule(30, 12, 6, 4, 5);

            Task task = new Task(30, 7, "Csanád Task 2", "Content");
            task = controlTable.queryTaskConnectionData(task);

            assertEquals(12, task.getColId());
            assertEquals(6, task.getSchedId());
            assertEquals(4, task.getStart());
            assertEquals(5, task.getEnd());
        }
    }

    @Test
    void updateTaskTime() throws SQLException {
        try (Connection con = DriverManager.getConnection(dbUrl, "test", "test")) {
            TaskAssignmentDaoImpl controlTable = new TaskAssignmentDaoImpl(con);

            controlTable.updateTaskTime(30, 4, 5);

            Task task = new Task(30, 7, "Csanád Task 2", "Content");
            task = controlTable.queryTaskConnectionData(task);

            assertEquals(4, task.getStart());
            assertEquals(5, task.getEnd());
        }
    }

    @Test
    void updateTaskColumn() throws SQLException {
        try (Connection con = DriverManager.getConnection(dbUrl, "test", "test")) {
            TaskAssignmentDaoImpl controlTable = new TaskAssignmentDaoImpl(con);

            controlTable.updateTaskColumn(2, 6, 4, 5);

            Task task = new Task(2, 4, "Csba Task 2", "Content");
            task = controlTable.queryTaskConnectionData(task);

            assertEquals(6, task.getColId());
            assertEquals(4, task.getStart());
            assertEquals(5, task.getEnd());
        }
    }

    @Test
    void deleteTask() throws SQLException {
        try (Connection con = DriverManager.getConnection(dbUrl, "test", "test")) {
            TaskAssignmentDaoImpl controlTable = new TaskAssignmentDaoImpl(con);

            controlTable.deleteTask(30);

            assertFalse(controlTable.queryTaskPresent(30));
        }
    }

    void resetDb() throws ClassNotFoundException, SQLException {
        Class.forName("org.postgresql.Driver");
        try (Connection con = DriverManager.getConnection(dbUrl, "test", "test")) {
            ScriptUtils.executeSqlScript(con, new ClassPathResource("/init.sql"));
        }
    }*/
}