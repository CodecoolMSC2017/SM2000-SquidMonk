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

class ScheduleDaoImplTest extends AbstractTest {

    @Test
    void findById() throws SQLException, ClassNotFoundException {
        resetDatabase();
        try (Connection connection = getConnection()) {
            ScheduleDao scheduleDao = new ScheduleDaoImpl(connection);

            Schedule schedule = scheduleDao.findById(1);
            assertEquals("Empty User sched", schedule.getName());

            schedule = scheduleDao.findById(2);
            assertTrue(schedule.isPublic());
        }
    }

    @Test
    void findAllByUserId() throws SQLException {
        try (Connection connection = getConnection()) {
            ScheduleDao scheduleDao = new ScheduleDaoImpl(connection);

            List<Schedule> scheduleList = scheduleDao.findAllByUserId(1);
            assertEquals(0, scheduleList.size());

            scheduleList = scheduleDao.findAllByUserId(2);
            assertEquals(1, scheduleList.size());
            assertEquals("Empty User sched", scheduleList.get(0).getName());
        }
    }
    /*
    @Test
    void insertSchedule() throws SQLException {
        try (Connection connection = getConnection()) {
            int userId = 3;
            String name = "Alexa sched insert test";

            ScheduleDaoImpl scheduleDao = new ScheduleDaoImpl(connection);
            scheduleDao.insertSchedule(userId, name);

            List<Schedule> schedules = new ScheduleDaoImpl(connection).findAllByUserId(3);
            assertEquals(2, schedules.size());
            assertEquals(15, schedules.get(1).getId());
            assertEquals(name, schedules.get(1).getName());
            assertFalse(schedules.get(1).isPublic());
        }
    }
    */
    @Test
    void updateVisibility() throws SQLException {
        try (Connection connection = getConnection()) {
            int scheduleId = 1;
            boolean isPublic = false;

            ScheduleDaoImpl scheduleDao = new ScheduleDaoImpl(connection);

            Schedule schedule = scheduleDao.findById(scheduleId);
            assertTrue(schedule.isPublic());

            scheduleDao.updateVisibility(scheduleId);
            Schedule scheduleUpdateVisibility = scheduleDao.findById(scheduleId);
            assertFalse(scheduleUpdateVisibility.isPublic());
        }
    }

    @Test
    void updateName() throws SQLException {
        try (Connection connection = getConnection()) {
            int scheduleId = 4;
            String name = "Csba sched updateNameTest";

            ScheduleDaoImpl scheduleDao = new ScheduleDaoImpl(connection);
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
}
