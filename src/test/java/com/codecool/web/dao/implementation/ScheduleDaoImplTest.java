package com.codecool.web.dao.implementation;

import com.codecool.web.dao.ScheduleDao;
import com.codecool.web.model.Schedule;
import org.junit.jupiter.api.Test;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ScheduleDaoImplTest extends AbstractTest {

    // execution order: 2 1 5 3 4 6

    /*
    @Test
        // 1
    void findById() throws SQLException {
        try (Connection connection = getConnection()) {
            ScheduleDao scheduleDao = new ScheduleDaoImpl(connection);

            Schedule schedule = scheduleDao.findById(1);
            assertEquals("Empty User sched", schedule.getName());

            schedule = scheduleDao.findById(2);
            assertTrue(schedule.isPublic());
        }
    }

    @Test
        // 2
    void findAllByUserId() throws SQLException {
        resetDatabase();
        try (Connection connection = getConnection()) {
            ScheduleDao scheduleDao = new ScheduleDaoImpl(connection);

            List<Schedule> scheduleList = scheduleDao.findAllByUserId(1);
            assertEquals(0, scheduleList.size());

            scheduleList = scheduleDao.findAllByUserId(2);
            assertEquals(1, scheduleList.size());
            assertEquals("Empty User sched", scheduleList.get(0).getName());
        }
    }

    @Test
        // 3
    void insertSchedule() throws SQLException {
        try (Connection connection = getConnection()) {
            ScheduleDao scheduleDao = new ScheduleDaoImpl(connection);

            int userId = 3;
            String name = "Alexa sched insert test";

            scheduleDao.insertSchedule(userId, name);

            List<Schedule> schedules = scheduleDao.findAllByUserId(3);
            assertEquals(2, schedules.size());
            assertEquals(16, schedules.get(1).getId());
            assertEquals(name, schedules.get(1).getName());
            assertFalse(schedules.get(1).isPublic());
        }
    }

    @Test
        // 4
    void updateVisibility() throws SQLException {
        try (Connection connection = getConnection()) {
            ScheduleDao scheduleDao = new ScheduleDaoImpl(connection);

            int scheduleId = 1;

            Schedule schedule = scheduleDao.findById(scheduleId);
            assertTrue(schedule.isPublic());

            scheduleDao.updateVisibility(scheduleId);
            Schedule scheduleUpdateVisibility = scheduleDao.findById(scheduleId);
            assertFalse(scheduleUpdateVisibility.isPublic());
        }
    }

    @Test
        // 5
    void updateName() throws SQLException {
        try (Connection connection = getConnection()) {
            ScheduleDao scheduleDao = new ScheduleDaoImpl(connection);

            int scheduleId = 4;
            String name = "Csba sched updateNameTest";

            Schedule schedule = scheduleDao.findById(scheduleId);
            assertEquals("Csba sched #2", schedule.getName());

            scheduleDao.updateName(scheduleId, name);
            Schedule scheduleUpdateNameTest = scheduleDao.findById(scheduleId);
            assertEquals("Csba sched updateNameTest", scheduleUpdateNameTest.getName());
        }
    }

    @Test
        // 6
    void deleteSchedule() throws SQLException {
        try (Connection connection = getConnection()) {
            ScheduleDao scheduleDao = new ScheduleDaoImpl(connection);

            Schedule schedule = scheduleDao.findById(16);
            assertEquals("Alexa sched insert test", schedule.getName());

        }
    }
    */
}
