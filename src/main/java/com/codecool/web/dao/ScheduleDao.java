package com.codecool.web.dao;

import com.codecool.web.model.Schedule;

import java.sql.SQLException;
import java.util.List;

public interface ScheduleDao {

    Schedule findById(int id) throws SQLException;

    List<Schedule> findAllByUserId(int userId) throws SQLException;

}
