package com.codecool.web.service.jsService;

import com.codecool.web.dao.ScheduleDao;
import com.codecool.web.dto.DashboardScheduleDto;
import com.codecool.web.service.ScheduleUserService;
import com.codecool.web.service.exception.ServiceException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.SQLException;
import java.util.List;

public class JsScheduleUserService implements ScheduleUserService {

    private static final Logger logger = LoggerFactory.getLogger(JsScheduleUserService.class);

    private ScheduleDao scheduleDao;

    public JsScheduleUserService(ScheduleDao scheduleDao) {
        this.scheduleDao = scheduleDao;
    }

    @Override
    public List<DashboardScheduleDto> findAllByUserId(int userId) throws SQLException {
        logger.debug("fetching schedules of user with id " + userId);
        return scheduleDao.findUserDashboardSchedules(userId);
    }

    @Override
    public void addSchedule(int userId, String name) throws SQLException, ServiceException {
        logger.debug("adding schedule for user with id " + userId);
        if (name == null || name.equals("")) {
            throw new ServiceException("Schedule name can not be empty!");
        }
        scheduleDao.insertSchedule(userId, name);
    }
}
