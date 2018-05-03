package com.codecool.web.dao.implementation;

import com.codecool.web.dao.UserDao;
import com.codecool.web.model.User;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class UserDaoImpl extends AbstractDao implements UserDao {

    private String queryUser = "SELECT id, name, email, password, is_admin FROM users ";

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
