package com.codecool.web.service;

import com.codecool.web.dto.DashboardScheduleDto;

import java.sql.SQLException;
import java.util.List;

public interface ScheduleUserService {

    List<DashboardScheduleDto> findAllByUserId(int userId) throws SQLException;

    void addSchedule(int userId, String name) throws SQLException;
}
