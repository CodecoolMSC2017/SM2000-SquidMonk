package com.codecool.web.dao.implementation;

import com.codecool.web.dao.ColumnDao;
import com.codecool.web.dao.ScheduleDao;
import com.codecool.web.dao.TaskDao;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ScriptUtils;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;

public class IntegrationTest {

    String dbUrl = "jdbc:postgresql://localhost:5432/sm2000_test";

    @BeforeEach
    void setUp() {

    }

    @Test
    void deleteSchedule() throws SQLException {
        try (Connection con = DriverManager.getConnection(dbUrl, "test", "test")) {
            TskColSchedConnectorDao controlTable = new TskColSchedConnectorDao(con);
            ScheduleDao scheduleDao = new ScheduleDaoImpl(con);
            ColumnDao columnDao = new ColumnDaoImpl(con);

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
        resetDb();
        try (Connection con = DriverManager.getConnection(dbUrl, "test", "test")) {
            TskColSchedConnectorDao controlTable = new TskColSchedConnectorDao(con);
            ScheduleDao scheduleDao = new ScheduleDaoImpl(con);
            ColumnDao columnDao = new ColumnDaoImpl(con);
            TaskDao taskDao = new TaskDaoImpl(con);

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

    void resetDb() throws ClassNotFoundException, SQLException {
        Class.forName("org.postgresql.Driver");
        try (Connection con = DriverManager.getConnection(dbUrl, "test", "test")) {
            ScriptUtils.executeSqlScript(con, new ClassPathResource("/init.sql"));
        }
    }
}
