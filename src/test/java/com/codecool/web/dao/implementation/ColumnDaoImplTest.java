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

    /*@Test
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

            columnDao.insertColumn(scheduleId, name);
            Column column = columnDao.findById(14);
            assertEquals(14, column.getId());
            assertEquals(name, column.getName());

            columnDao.insertColumn(1, "new 2");
            columnDao.insertColumn(1, "new 3");
            columnDao.insertColumn(1, "new 4");
            columnDao.insertColumn(1, "new 5");
            columnDao.insertColumn(1, "new 6");
            columnDao.insertColumn(1, "new 7");
            assertThrows(SQLException.class, () -> columnDao.insertColumn(1, "new 8"));
        }
    }

    @Test
    void updateName() throws SQLException {
        try (Connection con = DriverManager.getConnection(dbUrl, "test", "test")) {
            int id = 4;
            String name = "ColumnNameTest";

            ColumnDaoImpl columnDao = new ColumnDaoImpl(con);
            Column column = columnDao.findById(id);
            assertEquals("Csba Column 1", column.getName());

            columnDao.updateName(id, name);
            Column columnUpdateName = columnDao.findById(id);
            assertEquals(name, columnUpdateName.getName());

        }
    }

    @Test
    void deleteColumn() throws SQLException {
    }

    void resetDb() throws ClassNotFoundException, SQLException {
        Class.forName("org.postgresql.Driver");
        try (Connection con = DriverManager.getConnection(dbUrl, "test", "test")) {
            ScriptUtils.executeSqlScript(con, new ClassPathResource("/init.sql"));
        }
    }*/
}