package com.codecool.web.dao.implementation;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

class TskColSchedConnectionDao extends AbstractDao {

    TskColSchedConnectionDao(Connection connection) {
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


}
