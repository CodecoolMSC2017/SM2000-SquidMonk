package com.codecool.web.dao;

import com.codecool.web.model.Task;

import java.sql.SQLException;
import java.util.List;

public interface TaskDao {

    Task findById(int id) throws SQLException;

    List<Task> findAllByUserId(int userId) throws SQLException;

}
