package com.codecool.web.dao;

import com.codecool.web.dto.DashboardScheduleDto;
import com.codecool.web.model.Schedule;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

public interface ScheduleDao {

    Schedule findById(int id) throws SQLException;

    List<Schedule> findAllByUserId(int userId) throws SQLException;

    void insertSchedule(int userId, String name) throws SQLException;

    void updateVisibility(int scheduleId, boolean isPublic) throws SQLException;

    void updateName(int scheduleId, String name) throws SQLException;

    void deleteSchedule(int scheduleId) throws SQLException;

    List<DashboardScheduleDto> findUserDashboardSchedules(int userId) throws SQLException;

    Map<Integer, String> findAllByTaskId(int taskId) throws SQLException;

    List<Integer> getSchedulesOfTask(int userId, int taskId) throws SQLException;
}
