package com.codecool.web.service.jsService;

import com.codecool.web.dao.ScheduleDao;
import com.codecool.web.dto.DashboardScheduleDto;
import com.codecool.web.service.ScheduleUserService;

import java.sql.SQLException;
import java.util.List;

public class JsScheduleUserService implements ScheduleUserService {

    private ScheduleDao scheduleDao;

    public JsScheduleUserService(ScheduleDao scheduleDao) {
        this.scheduleDao = scheduleDao;
    }

    @Override
    public List<DashboardScheduleDto> findAllByUserId(int userId) throws SQLException {
        return scheduleDao.findUserDashboardSchedules(userId);
    }

    @Override
    public void addSchedule(int userId, String name) throws SQLException {
        scheduleDao.insertSchedule(userId, name);
    }
}
