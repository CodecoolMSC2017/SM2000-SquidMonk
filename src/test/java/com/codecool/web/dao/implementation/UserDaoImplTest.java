package com.codecool.web.dao.implementation;

import com.codecool.web.dao.UserDao;
import com.codecool.web.model.User;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ScriptUtils;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import static org.junit.jupiter.api.Assertions.*;

public class UserDaoImplTest {

    String dbUrl = "jdbc:postgresql://localhost:5432/sm2000_test";

    @BeforeEach
    void setUp() throws ClassNotFoundException, SQLException {
        Class.forName("org.postgresql.Driver");
        try (Connection con = DriverManager.getConnection(dbUrl, "test", "test")) {
            ScriptUtils.executeSqlScript(con, new ClassPathResource("/init.sql"));
        }
    }

    @AfterEach
    void tearDown() {
    }

    @Test
    public void findById() throws SQLException {
        try (Connection con = DriverManager.getConnection(dbUrl, "test", "test")) {
            UserDao userDao = new UserDaoImpl(con);
            User user = userDao.findById(1);
            assertEquals("Admin", user.getName());

            user = userDao.findById(3);
            assertEquals("alexa@codecool.hu", user.getEmail());

            user = userDao.findById(6);
            assertFalse(user.isAdmin());

            user = userDao.findById(58745);
            assertNull(user);
        }
    }

    @Test
    void findByEmail() throws SQLException {
        try (Connection con = DriverManager.getConnection(dbUrl, "test", "test")) {
            UserDao userDao = new UserDaoImpl(con);
            User user = userDao.findByEmail("admin@codecool.hu");
            assertEquals("Admin", user.getName());

            user = userDao.findByEmail("alexa@codecool.hu");
            assertEquals("alexa@codecool.hu", user.getEmail());

            user = userDao.findByEmail("fbence@codecool.hu");
            assertFalse(user.isAdmin());

            user = userDao.findByEmail("kiskutya@farka.hu");
            assertNull(user);

            assertThrows(IllegalArgumentException.class, () -> userDao.findByEmail(""));
            assertThrows(IllegalArgumentException.class, () -> userDao.findByEmail(null));
        }
    }

    @Test
    void insertUser() {
    }

    @Test
    void changeRole() {
    }
}