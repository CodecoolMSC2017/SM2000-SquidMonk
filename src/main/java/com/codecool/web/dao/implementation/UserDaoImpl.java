package com.codecool.web.dao.implementation;

import com.codecool.web.dao.UserDao;
import com.codecool.web.model.User;

import java.sql.*;

public class UserDaoImpl extends AbstractDao implements UserDao {

    private final String queryUser = "SELECT id, name, email, password, is_admin FROM users ";

    public UserDaoImpl(Connection connection) {
        super(connection);
    }

    @Override
    public User findById(int id) throws SQLException {
        String sql = queryUser + "WHERE id = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, id);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    return fetchUser(resultSet);
                }
            }
        }
        return null;
    }

    @Override
    public User findByEmail(String email) throws SQLException {
        if (email == null || email.equals("")) {
            throw new IllegalArgumentException("Email can't be empty");
        }
        String sql = queryUser + "WHERE email = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, email);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    return fetchUser(resultSet);
                }
            }
        }
        return null;
    }

    @Override
    public User insertUser(String name, String email, String password) throws SQLException {
        boolean autocommit = connection.getAutoCommit();
        connection.setAutoCommit(false);

        String sql = "INSERT INTO users (name, email, password, is_admin) VALUES (?, ?, ?, ?)";
        try (PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            statement.setString(1, name);
            statement.setString(2, email);
            statement.setString(3, password);
            statement.setBoolean(4, false);

            executeInsert(statement);
            int id = fetchGeneratedId(statement);

            return new User(id, name, email, password);
        } catch (SQLException e) {
            connection.rollback();
            throw e;
        } finally {
            connection.setAutoCommit(autocommit);
        }
    }

    @Override
    public void changeRole(int userId, boolean isAdmin) throws SQLException {
        boolean autocommit = connection.getAutoCommit();
        connection.setAutoCommit(false);

        String sql = "UPDATE users SET is_admin = ? WHERE id = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setBoolean(1, isAdmin);
            statement.setInt(2, userId);

            executeInsert(statement);
        } catch (SQLException e) {
            connection.rollback();
            throw e;
        } finally {
            connection.setAutoCommit(autocommit);
        }
    }

    private User fetchUser(ResultSet resultSet) throws SQLException {
        int id = resultSet.getInt("id");
        String name = resultSet.getString("name");
        String email = resultSet.getString("email");
        String password = resultSet.getString("password");
        boolean isAdmin = resultSet.getBoolean("is_admin");

        User user = new User(id, name, email, password);

        if (isAdmin) {
            user.setAdmin();
        }
        return user;
    }

}
