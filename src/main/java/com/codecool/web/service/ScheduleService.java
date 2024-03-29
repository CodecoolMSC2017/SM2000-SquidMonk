package com.codecool.web.service;

import com.codecool.web.dto.ScheduleDto;
import com.codecool.web.model.Column;
import com.codecool.web.model.Task;

import java.sql.SQLException;
import java.util.List;

public interface ScheduleService {

    List<Column> getColumnsByScheduleId(int schedId) throws SQLException;

    List<Task> getTasksByScheduleId(int schedId) throws SQLException;

    ScheduleDto fillScheduleDto(int schedId) throws SQLException;

    boolean getVisibility(int schedId) throws SQLException;

    void updateVisibility(int schedId) throws SQLException;

    void addNewColumnToSchedule(int schedId, String columnName) throws SQLException;

    void updateColumnName(int columnId, String columnName) throws SQLException;

    void deleteSchedule(int schedID) throws SQLException;
}
