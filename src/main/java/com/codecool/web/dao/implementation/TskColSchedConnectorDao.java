package com.codecool.web.dao.implementation;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

class TskColSchedConnectorDao extends AbstractDao {

    TskColSchedConnectorDao(Connection connection) {
        super(connection);
    }

    boolean queryTaskPresent(int taskId) throws SQLException {
        String sql = "SELECT task_id FROM col_tsk WHERE task_id = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, taskId);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    String id = resultSet.getString("task_id");
                    return id != null;
                }
            }
        }
        return false;
    }

    void insertTask(int taskId, int colId, int scheduleId, int taskStart, int taskEnd) throws SQLException {
        String sql = "INSERT INTO col_tsk (task_id, col_id, schedule_id, task_start, task_end) VALUES (?,?,?,?,?)";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, taskId);
            statement.setInt(2, colId);
            statement.setInt(3, scheduleId);
            statement.setInt(4, taskStart);
            statement.setInt(5, taskEnd);
            executeInsert(statement);
        }
    }
    /*
    TODO: You have to select and get the data for the following first, in case you don't update everything.
    TODO: For this you will be needing a control object which can hold the data.
     */
    void updateTask(int taskId, int colId, int scheduleId, int taskStart, int taskEnd) throws SQLException {
        String sql = "UPDATE col_tsk SET col_id=?, schedule_id=?, task_start=?, task_end=? WHERE task_id=?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, taskId);
            statement.setInt(2, colId);
            statement.setInt(3, scheduleId);
            statement.setInt(4, taskStart);
            statement.setInt(5, taskEnd);
            executeInsert(statement);
        }
    }
}
