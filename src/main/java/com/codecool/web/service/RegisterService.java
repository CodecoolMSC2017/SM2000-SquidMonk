package com.codecool.web.service;

import com.codecool.web.model.User;
import com.codecool.web.service.exception.ServiceException;

import java.sql.SQLException;

public interface RegisterService {

    User registerUser(String name, String email, String password) throws SQLException;
}
