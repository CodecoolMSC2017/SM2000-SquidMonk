package com.codecool.web.service;

import com.codecool.web.model.User;
import com.codecool.web.service.exception.ServiceException;

import java.sql.SQLException;
import java.util.List;

public interface UsersService {

    List<User> getUsers() throws SQLException, ServiceException;
}
