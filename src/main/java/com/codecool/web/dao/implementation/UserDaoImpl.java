package com.codecool.web.dao.implementation;

import com.codecool.web.dao.UserDao;
import com.codecool.web.model.User;
import com.codecool.web.service.PassEncrypt;
import com.codecool.web.service.exception.ServiceException;

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
