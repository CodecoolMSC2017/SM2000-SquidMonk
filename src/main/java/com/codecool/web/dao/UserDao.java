package com.codecool.web.dao;

import com.codecool.web.model.User;

import java.sql.SQLException;

public interface UserDao {

    User findById(int id) throws SQLException;

    User findByEmail(String email) throws SQLException;

    User insertUser(String name, String email, String password) throws SQLException;

    void changeRole(int userId, boolean isAdmin) throws SQLException;

}
