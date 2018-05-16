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

    /*@Test
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
    void insertSchedule() throws SQLException {
        try (Connection con = DriverManager.getConnection(dbUrl, "test", "test")) {
            int userId = 3;
            String name = "Alexa sched insert test";

            ScheduleDaoImpl scheduleDao = new ScheduleDaoImpl(con);
            scheduleDao.insertSchedule(userId, name);

            List<Schedule> schedules = new ScheduleDaoImpl(con).findAllByUserId(3);
            assertEquals(2, schedules.size());
            assertEquals(15, schedules.get(1).getId());
            assertEquals(name, schedules.get(1).getName());
            assertFalse(schedules.get(1).isPublic());
        }
    }

    @Test
    void updateVisibility() throws SQLException {
        try (Connection con = DriverManager.getConnection(dbUrl, "test", "test")) {
            int scheduleId = 1;
            boolean isPublic = false;

            ScheduleDaoImpl scheduleDao = new ScheduleDaoImpl(con);

            Schedule schedule = scheduleDao.findById(scheduleId);
            assertTrue(schedule.isPublic());

            scheduleDao.updateVisibility(scheduleId, isPublic);
            Schedule scheduleUpdateVisibility = scheduleDao.findById(scheduleId);
            assertFalse(scheduleUpdateVisibility.isPublic());
        }
    }

    @Test
    void updateName() throws SQLException {
        try (Connection con = DriverManager.getConnection(dbUrl, "test", "test")) {
            int scheduleId = 4;
            String name = "Csba sched updateNameTest";

            ScheduleDaoImpl scheduleDao = new ScheduleDaoImpl(con);
            Schedule schedule = scheduleDao.findById(scheduleId);
            assertEquals("Csba sched #2", schedule.getName());

            scheduleDao.updateName(scheduleId, name);
            Schedule scheduleUpdateNameTest = scheduleDao.findById(scheduleId);
            assertEquals("Csba sched updateNameTest", scheduleUpdateNameTest.getName());
        }
    }

    @Test
    void deleteSchedule() {
    }

    void resetDb() throws ClassNotFoundException, SQLException {
        Class.forName("org.postgresql.Driver");
        try (Connection con = DriverManager.getConnection(dbUrl, "test", "test")) {
            ScriptUtils.executeSqlScript(con, new ClassPathResource("/init.sql"));
        }
    }*/
}