package com.codecool.web.dao.implementation;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ScriptUtils;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import static org.junit.jupiter.api.Assertions.*;

class UserDaoImplTest {

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
    void findById() {
    }

    @Test
    void findByEmail() {
    }

    @Test
    void insertUser() {
    }

    @Test
    void changeRole() {
    }
}