package com.codecool.web.dao.implementation;

import com.codecool.web.dao.ScheduleDao;
import com.codecool.web.model.Schedule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ScriptUtils;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ScheduleDaoImplTest {

    String dbUrl = "jdbc:postgresql://localhost:5432/sm2000_test";

    @BeforeEach
    void setUp() throws ClassNotFoundException, SQLException {

    }

    @Test
    void findById() throws SQLException, ClassNotFoundException {
        resetDb();
        try (Connection con = DriverManager.getConnection(dbUrl, "test", "test")) {
            ScheduleDao scheduleDao = new ScheduleDaoImpl(con);

            Schedule schedule = scheduleDao.findById(1);
            assertEquals("Empty User sched", schedule.getName());

            schedule = scheduleDao.findById(2);
            assertTrue(schedule.isPublic());
        }
    }

    @Test
    void findAllByUserId() throws SQLException {
        try (Connection con = DriverManager.getConnection(dbUrl, "test", "test")) {
            ScheduleDao scheduleDao = new ScheduleDaoImpl(con);

            List<Schedule> scheduleList = scheduleDao.findAllByUserId(1);
            assertEquals(0, scheduleList.size());

            scheduleList = scheduleDao.findAllByUserId(2);
            assertEquals(1, scheduleList.size());
            assertEquals("Empty User sched", scheduleList.get(0).getName());
        }
    }

    @Test
    void insertSchedule() {
    }

    @Test
    void updateVisibility() {
    }

    @Test
    void updateName() {
    }

    @Test
    void deleteSchedule() {
    }

    @Test
    void updateScheduleCount() {
    }

    void resetDb() throws ClassNotFoundException, SQLException {
        Class.forName("org.postgresql.Driver");
        try (Connection con = DriverManager.getConnection(dbUrl, "test", "test")) {
            ScriptUtils.executeSqlScript(con, new ClassPathResource("/init.sql"));
        }
    }
}