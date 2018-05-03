package com.codecool.web.dao.implementation;

import com.codecool.web.dao.TaskDao;
import com.codecool.web.model.Task;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

public class TaskDaoImpl extends AbstractDao implements TaskDao {

    private String queryTasks = "";

    public TaskDaoImpl(Connection connection) {
        super(connection);
    }

    @Override
    public Task findById(int id) throws SQLException {
        return null;
    }

    @Override
    public List<Task> findAllByEmail(String email) throws SQLException {
        return null;
    }
}
