package com.codecool.web.dao.implementation;

import com.codecool.web.dao.ScheduleDao;
import com.codecool.web.model.Column;
import com.codecool.web.model.Schedule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ScriptUtils;

import java.sql.*;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ColumnDaoImplTest {

    String dbUrl = "jdbc:postgresql://localhost:5432/sm2000_test";

    @BeforeEach
    void setUp() throws ClassNotFoundException, SQLException {

    }

    @Test
    void findById() throws SQLException, ClassNotFoundException {
        try (Connection con = DriverManager.getConnection(dbUrl, "test", "test")) {
            resetDb();
            Column column1 = new ColumnDaoImpl(con).findById(1);
            Column column2 = new ColumnDaoImpl(con).findById(2);
            Column column3 = new ColumnDaoImpl(con).findById(7);

            assertEquals("Alexa Column 1", column1.getName());
            assertEquals("Alexa Column 2", column2.getName());
            assertEquals("Csba Column 4", column3.getName());
        }
    }

    @Test
    void findAllByScheduleId() throws SQLException {
        try (Connection con = DriverManager.getConnection(dbUrl, "test", "test")) {
            List<Column> columns = new ColumnDaoImpl(con).findAllByScheduleId(2);

            assertEquals(3, columns.size());
            assertEquals("Alexa Column 1", columns.get(0).getName());
            assertEquals("Alexa Column 2", columns.get(1).getName());
            assertEquals("Alexa Column 3", columns.get(2).getName());
        }
    }

    @Test
    void insertColumn() throws SQLException {
        try (Connection con = DriverManager.getConnection(dbUrl, "test", "test")) {
            ColumnDaoImpl columnDao = new ColumnDaoImpl(con);
            int scheduleId = 1;
            String name = "InsertColumn";
            ScheduleDao scheduleDao = new ScheduleDaoImpl(con);

            columnDao.insertColumn(scheduleId, name, scheduleDao);
            List<Column> columns = new ColumnDaoImpl(con).findAllByScheduleId(1);
            assertEquals(12, columns.get(0).getId());
            assertEquals("InsertColumn", columns.get(0).getName());


        }
    }

    @Test
    void updateName() {
    }

    @Test
    void deleteColumn() {
    }

    @Test
    void updateColumnCount() {
    }

    void resetDb() throws ClassNotFoundException, SQLException {
        Class.forName("org.postgresql.Driver");
        try (Connection con = DriverManager.getConnection(dbUrl, "test", "test")) {
            ScriptUtils.executeSqlScript(con, new ClassPathResource("/init.sql"));
        }
    }
}