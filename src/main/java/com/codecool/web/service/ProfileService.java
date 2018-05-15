package com.codecool.web.service;

import com.codecool.web.model.User;
import com.codecool.web.service.exception.ServiceException;

import java.sql.SQLException;

public interface ProfileService {

    User showDataByUserId(int userId) throws SQLException, ServiceException;
}
