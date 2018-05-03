package com.codecool.web.dao.implementation;

import com.codecool.web.model.Task;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ScriptUtils;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class TaskDaoImplTest {

    String dbUrl = "jdbc:postgresql://localhost:5432/sm2000_test";

    @BeforeEach
    void setUp() throws ClassNotFoundException, SQLException {

    }

    @Test
    void findById() throws SQLException, ClassNotFoundException {
        try (Connection con = DriverManager.getConnection(dbUrl, "test", "test")) {
            resetDb();
            Task task1 = new TaskDaoImpl(con).findById(1);
            Task task2 = new TaskDaoImpl(con).findById(2);
            Task task3 = new TaskDaoImpl(con).findById(10);

            assertEquals("Csba Task 1", task1.getName());
            assertEquals("Content", task1.getContent());
            assertEquals("Csba Task 2", task2.getName());
            assertEquals("Content", task2.getContent());
            assertEquals("Bence Task 7", task3.getName());
            assertEquals("Content", task3.getContent());
        }
    }

    @Test
    void findAllByUserId() throws SQLException {
        try (Connection con = DriverManager.getConnection(dbUrl, "test", "test")) {
            List<Task> tasks = new TaskDaoImpl(con).findAllByUserId(4);

            assertEquals("Csba Task 1", tasks.get(0).getName());
            assertEquals("Csba Task 2", tasks.get(1).getName());
            assertEquals("Csba Task 3", tasks.get(2).getName());
        }
    }

    @Test
    void insertTask() throws SQLException {
        try (Connection con = DriverManager.getConnection(dbUrl, "test", "test")) {

            int id = 29;
            String name = "Csba Task 4";
            String content = "Content";

            TaskDaoImpl taskDao = new TaskDaoImpl(con);
            taskDao.insertTask(4, name, content);

            List<Task> tasksAgain = new TaskDaoImpl(con).findAllByUserId(4);
            assertEquals(id, tasksAgain.get(3).getId());
            assertEquals(name, tasksAgain.get(3).getName());
            assertEquals(content, tasksAgain.get(3).getContent());
        }
    }

    @Test
    void deleteTask() throws SQLException {
        /*try (Connection con = DriverManager.getConnection(dbUrl, "test", "test")) {
            int id = 1;

            TaskDaoImpl taskDao = new TaskDaoImpl(con);
            Task task = taskDao.findById(id);
            assertFalse(task.equals(null));
            taskDao.deleteTask(id);
            Task taskDelete = taskDao.findById(id);
            assertTrue(taskDelete.equals(null));
        }*/
    }

    @Test
    void updateName() {
    }

    @Test
    void updateContent() {
    }

    void resetDb() throws ClassNotFoundException, SQLException {
        Class.forName("org.postgresql.Driver");
        try (Connection con = DriverManager.getConnection(dbUrl, "test", "test")) {
            ScriptUtils.executeSqlScript(con, new ClassPathResource("/init.sql"));
        }
    }
}

