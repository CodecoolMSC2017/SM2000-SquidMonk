package com.codecool.web.dao.implementation;

import com.codecool.web.dao.UserDao;
import com.codecool.web.model.User;
import com.codecool.web.service.PassEncrypt;
import com.codecool.web.service.exception.ServiceException;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

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
    public User findByEmail(String email) throws SQLException, ServiceException {
        if (email == null || email.equals("")) {
            throw new ServiceException("Email can't be empty");
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

        String sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
        try (PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            String encryptedPassword = new PassEncrypt().encrypt(password);
            statement.setString(1, name);
            statement.setString(2, email);
            statement.setString(3, encryptedPassword);

            executeInsert(statement);
            int id = fetchGeneratedId(statement);

            return new User(id, name, email, password);
        }
    }

    @Override
    public void changeRole(int userId, boolean isAdmin) throws SQLException {

        String sql = "UPDATE users SET is_admin = ? WHERE id = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setBoolean(1, isAdmin);
            statement.setInt(2, userId);
            executeInsert(statement);
        }
    }

    @Override
    public void changeName(int userId, String name) throws SQLException {

        String sql = "UPDATE users SET name = ? WHERE id = ?";

        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, name);
            statement.setInt(2, userId);
            executeInsert(statement);
        }
    }

    @Override
    public void changeEmail(int userId, String email) throws SQLException {

        String sql = "UPDATE users SET email = ? WHERE id = ?";

        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, email);
            statement.setInt(2, userId);
            executeInsert(statement);
        }
    }

    @Override
    public void deleteUser(int userId) throws SQLException {
        String sql = "DELETE FROM users WHERE id = ?";

        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, userId);
            executeInsert(statement);
        }
    }

    @Override
    public List<User> findAll() throws SQLException {
        String sql = "SELECT id, name, email, password, is_admin FROM users ORDER BY id";

        try (Statement statement = connection.createStatement();
             ResultSet resultSet = statement.executeQuery(sql)) {
             List<User> users = new ArrayList<>();
             while (resultSet.next()) {
                 users.add(fetchUser(resultSet));
             }
             return users;
        }
    }

    @Override
    public int counterTaskByUserId(int userId) throws SQLException {
        int taskCounter = 0;
        String sql = "SELECT * FROM tasks WHERE user_id = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, userId);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    taskCounter++;
                }
            }
        }
        return taskCounter;
    }

    @Override
    public int counterScheduleByUserId(int userId) throws SQLException {
        int scheduleCounter = 0;
        String sql = "SELECT * FROM schedules WHERE user_id = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, userId);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    scheduleCounter++;
                }
            }
        }
        return scheduleCounter;
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
