package com.codecool.web.dao;

import com.codecool.web.model.User;
import com.codecool.web.service.exception.ServiceException;

import java.sql.SQLException;

public interface UserDao {

    User findById(int id) throws SQLException;

    User findByEmail(String email) throws SQLException, ServiceException;

    User insertUser(String name, String email, String password) throws SQLException;

    void changeRole(int userId, boolean isAdmin) throws SQLException;

    void changeName(int userId, String name) throws SQLException;

    void deleteUser(int userId) throws SQLException;

}
