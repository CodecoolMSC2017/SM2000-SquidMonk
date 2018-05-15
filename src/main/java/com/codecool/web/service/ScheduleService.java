package com.codecool.web.service;

import com.codecool.web.model.Column;
import com.codecool.web.model.Task;

import java.sql.SQLException;
import java.util.List;

public interface ScheduleService {

    List<Column> getColumnsByScheduleId(int schedId) throws SQLException;

    List<Task> getTasksByScheduleId(int schedId) throws SQLException;
}
