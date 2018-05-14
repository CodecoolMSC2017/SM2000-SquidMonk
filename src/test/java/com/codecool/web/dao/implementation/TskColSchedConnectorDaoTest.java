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

class TskColSchedConnectorDaoTest {

    String dbUrl = "jdbc:postgresql://localhost:5432/sm2000_test";

    @BeforeEach
    void setUp() {
    }

    @Test
    void queryTaskPresent() throws SQLException {
        try (Connection con = DriverManager.getConnection(dbUrl, "test", "test")) {
            TskColSchedConnectorDao controlTable = new TskColSchedConnectorDao(con);
            assertFalse(controlTable.queryTaskPresent(300));
            assertTrue(controlTable.queryTaskPresent(1));
        }
    }

    @Test
    void queryTaskConnectionData() throws SQLException, ClassNotFoundException {
        resetDb();
        try (Connection con = DriverManager.getConnection(dbUrl, "test", "test")) {
            TskColSchedConnectorDao controlTable = new TskColSchedConnectorDao(con);

            Task task = new Task(1, "Csba Task 1", "Content");
            task = controlTable.queryTaskConnectionData(task);

            assertEquals(4, task.getCol_id());
            assertEquals(4, task.getSched_id());
            assertEquals(10, task.getStart());
            assertEquals(14, task.getEnd());
        }
    }

    @Test
    void insertTask() throws SQLException {
        try (Connection con = DriverManager.getConnection(dbUrl, "test", "test")) {
            TskColSchedConnectorDao controlTable = new TskColSchedConnectorDao(con);

            controlTable.insertTask(29, 12, 6, 6, 12);

            Task task = new Task(29, "Csanád Task 1", "Content");
            task = controlTable.queryTaskConnectionData(task);

            assertEquals(12, task.getCol_id());
            assertEquals(6, task.getSched_id());
            assertEquals(6, task.getStart());
            assertEquals(12, task.getEnd());
        }
    }

    @Test
    void updateTaskSchedule() throws SQLException {
        try (Connection con = DriverManager.getConnection(dbUrl, "test", "test")) {
            TskColSchedConnectorDao controlTable = new TskColSchedConnectorDao(con);

            controlTable.updateTaskSchedule(30, 12, 6, 4, 5);

            Task task = new Task(30, "Csanád Task 2", "Content");
            task = controlTable.queryTaskConnectionData(task);

            assertEquals(12, task.getCol_id());
            assertEquals(6, task.getSched_id());
            assertEquals(4, task.getStart());
            assertEquals(5, task.getEnd());
        }
    }

    @Test
    void updateTaskTime() {
    }

    @Test
    void updateTaskColumn() {
    }

    @Test
    void deleteTask() {
    }

    void resetDb() throws ClassNotFoundException, SQLException {
        Class.forName("org.postgresql.Driver");
        try (Connection con = DriverManager.getConnection(dbUrl, "test", "test")) {
            ScriptUtils.executeSqlScript(con, new ClassPathResource("/init.sql"));
        }
    }
}