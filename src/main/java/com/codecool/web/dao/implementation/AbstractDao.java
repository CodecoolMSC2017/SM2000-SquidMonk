package com.codecool.web.dao.implementation;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

abstract class AbstractDao {

    final Connection connection;

    AbstractDao(Connection connection) {
        this.connection = connection;
    }

    void executeInsert(PreparedStatement statement) throws SQLException {
        int insertCount;
        boolean autocommit = connection.getAutoCommit();
        connection.setAutoCommit(false);

        try {
            insertCount = statement.executeUpdate();

            if (insertCount != 1) {
                throw new SQLException("Expected 1 row to be inserted");
            } else {
                connection.commit();
            }
        } catch (SQLException e) {
            connection.rollback();
            throw e;
        } finally {
            connection.setAutoCommit(autocommit);
        }
    }

    int fetchGeneratedId(PreparedStatement statement) throws SQLException {
        int id;
        boolean autocommit = connection.getAutoCommit();
        connection.setAutoCommit(false);

        try (ResultSet resultSet = statement.getGeneratedKeys()) {
            if (resultSet.next()) {
                id = resultSet.getInt(1);
            } else {
                connection.rollback();
                throw new SQLException("Expected 1 result");
            }
        }
        connection.commit();
        connection.setAutoCommit(autocommit);
        return id;
    }
}
