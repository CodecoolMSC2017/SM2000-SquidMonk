package com.codecool.web.dao.implementation;

import com.codecool.web.dao.ScheduleDao;
import com.codecool.web.model.Schedule;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

public class ScheduleDaoImpl extends AbstractDao implements ScheduleDao {

    private String querySchedules = "";

    public ScheduleDaoImpl(Connection connection) {
        super(connection);
    }

    @Override
    public Schedule findById(int id) throws SQLException {
        return null;
    }

    @Override
    public List<Schedule> findAllByEmail(String email) throws SQLException {
        return null;
    }
}
