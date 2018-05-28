package com.codecool.web.service;

import com.codecool.web.model.User;
import com.codecool.web.service.exception.ServiceException;

import java.sql.SQLException;

public interface ProfileService {

    User showDataByUserId(int userId) throws SQLException, ServiceException;
    void changeUserName(int userId, String name) throws SQLException, ServiceException;
    void changeUserEmail(int userId, String email) throws SQLException, ServiceException;
}
