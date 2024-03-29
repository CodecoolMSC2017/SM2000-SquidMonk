package com.codecool.web.dao.implementation;

import com.codecool.web.dao.TaskDao;
import com.codecool.web.dto.DashboardTaskDto;
import com.codecool.web.model.Task;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class TaskDaoImpl extends AbstractDao implements TaskDao {

    private final String queryTasks = "SELECT id, user_id, name, content FROM tasks ";

    public TaskDaoImpl(Connection connection) {
        super(connection);
    }

    @Override
    public Task findById(int id) throws SQLException {
        String sql = queryTasks + "WHERE id = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, id);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    return fetchTask(resultSet);
                }
            }
        }
        return null;
    }

    @Override
    public List<Task> findAllByUserId(int userId) throws SQLException {
        List<Task> tasks = new ArrayList<>();
        String sql = queryTasks + "WHERE user_id = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, userId);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    tasks.add(fetchTask(resultSet));
                }
            }
        }
        return tasks;
    }

    @Override
    public int insertTask(int userId, String name, String content) throws SQLException {
        String sql = "INSERT INTO tasks (user_id, name, content) VALUES (?, ?, ?)";
        try (PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            statement.setInt(1, userId);
            statement.setString(2, name);
            statement.setString(3, content);
            executeInsert(statement);

            return fetchGeneratedId(statement);
        }
    }

    @Override
    public void deleteTask(int taskId) throws SQLException {
        String sql = "DELETE FROM tasks WHERE id = ?";

        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, taskId);
            executeInsert(statement);
        }
    }

    @Override
    public void updateName(int taskId, String name) throws SQLException {
        String sql = "UPDATE tasks SET name = ? WHERE id = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, name);
            statement.setInt(2, taskId);

            executeInsert(statement);
        }
    }

    @Override
    public void updateContent(int taskId, String content) throws SQLException {
        String sql = "UPDATE tasks SET content = ? WHERE id = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, content);
            statement.setInt(2, taskId);

            executeInsert(statement);
        }
    }

    @Override
    public List<DashboardTaskDto> findTaskUsages(int userId) throws SQLException {
        List<DashboardTaskDto> tasks = new ArrayList<>();
        String sql = "SELECT id, name FROM tasks WHERE user_id = ? ORDER BY id DESC";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, userId);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    tasks.add(fetchDashboardTaskDto(resultSet));
                }
            }
        }
        return tasks;
    }

    private DashboardTaskDto fetchDashboardTaskDto(ResultSet resultSet) throws SQLException {
        int id = resultSet.getInt("id");
        String name = resultSet.getString("name");
        int amount = getOccurrences(id);
        return new DashboardTaskDto(id, name, amount);
    }

    private int getOccurrences(int id) throws SQLException {
        String sql = "SELECT COUNT(task_id) AS amount FROM col_tsk WHERE task_id = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, id);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    return resultSet.getInt("amount");
                }
            }
        }
        return 0;
    }

    private Task fetchTask(ResultSet resultSet) throws SQLException {
        int id = resultSet.getInt("id");
        int userId = resultSet.getInt("user_id");
        String name = resultSet.getString("name");
        String content = resultSet.getString("content");

        return new Task(id, userId, name, content);
    }
}
