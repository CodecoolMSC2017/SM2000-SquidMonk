package com.codecool.web.dao.implementation;

import com.codecool.web.dao.ColumnDao;
import com.codecool.web.model.Column;
import org.junit.jupiter.api.Test;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class ColumnDaoImplTest extends AbstractTest {

    // execution order: 5 2 1 4 3

    @Test
        // 1
    void findById() throws SQLException {
        try (Connection connection = getConnection()) {
            ColumnDao columnDao = new ColumnDaoImpl(connection);

            Column column1 = columnDao.findById(1);
            Column column2 = columnDao.findById(2);
            Column column3 = columnDao.findById(7);

            assertEquals("Alexa Column 1", column1.getName());
            assertEquals("Alexa Column 2", column2.getName());
            assertEquals("Csba Column 4", column3.getName());
        }
    }

    @Test
        // 2
    void findAllByScheduleId() throws SQLException {
        try (Connection connection = getConnection()) {
            ColumnDao columnDao = new ColumnDaoImpl(connection);

            List<Column> columns = columnDao.findAllByScheduleId(2);

            assertEquals(3, columns.size());
            assertEquals("Alexa Column 1", columns.get(0).getName());
            assertEquals("Alexa Column 2", columns.get(1).getName());
            assertEquals("Alexa Column 3", columns.get(2).getName());
        }
    }

    @Test
        // 3
    void insertColumn() throws SQLException {
        try (Connection connection = getConnection()) {
            ColumnDao columnDao = new ColumnDaoImpl(connection);

            int scheduleId = 1;
            String name = "InsertColumn";

            columnDao.insertColumn(scheduleId, name);
            Column column = columnDao.findById(21);
            assertEquals(21, column.getId());
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
        // 4
    void updateName() throws SQLException {
        try (Connection connection = getConnection()) {
            ColumnDao columnDao = new ColumnDaoImpl(connection);

            int id = 4;
            String name = "ColumnNameTest";

            Column column = columnDao.findById(id);
            assertEquals("Csba Column 1", column.getName());

            columnDao.updateName(id, name);
            Column columnUpdateName = columnDao.findById(id);
            assertEquals(name, columnUpdateName.getName());

        }
    }

    @Test
        // 5
    void deleteColumn() {
        resetDatabase();
    }
}
