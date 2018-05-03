package com.codecool.web.service.jsService;

import com.codecool.web.dao.UserDao;
import com.codecool.web.model.User;
import com.codecool.web.service.LoginService;
import com.codecool.web.service.RegisterService;
import com.codecool.web.service.exception.ServiceException;

import java.sql.SQLException;

public class JsRegisterService implements RegisterService {

    private final UserDao userDao;

    public JsRegisterService(UserDao userDao) {
        this.userDao = userDao;
    }

    @Override
    public User registerUser(String name, String email, String password) throws SQLException, ServiceException {
        User user = userDao.insertUser(name, email, password);
        return user;
    }
}
