package com.codecool.web.dao;

import com.codecool.web.model.Column;

import java.sql.SQLException;
import java.util.List;

public interface ColumnDao {

    Column findById(int id) throws SQLException;

    List<Column> findAllByScheduleId(int scheduleId) throws SQLException;

    void insertColumn(int scheduleId, String name, ScheduleDao scheduleDao) throws SQLException;

    void updateName(int columnId, String name) throws SQLException;

    void deleteColumn(int columnId) throws SQLException;

    void updateColumnCount(int columnId) throws SQLException;

}
