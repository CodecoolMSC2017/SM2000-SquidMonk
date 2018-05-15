package com.codecool.web.service.jsService;

import com.codecool.web.model.Column;
import com.codecool.web.model.Task;
import com.codecool.web.service.ScheduleService;

import java.sql.SQLException;
import java.util.List;

public class jsScheduleService implements ScheduleService {

    @Override
    public List<Column> getColumnsByScheduleId(int schedId) throws SQLException {
        return null;
    }

    @Override
    public List<Task> getTasksByScheduleId(int schedId) throws SQLException {
        return null;
    }
}
