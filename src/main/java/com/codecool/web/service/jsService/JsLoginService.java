package com.codecool.web.service.jsService;

import com.codecool.web.dao.UserDao;
import com.codecool.web.model.User;
import com.codecool.web.service.LoginService;
import com.codecool.web.service.PassEncrypt;
import com.codecool.web.service.exception.ServiceException;

import java.sql.SQLException;

public class JsLoginService implements LoginService {

    private final UserDao userDao;

    public JsLoginService(UserDao userDao) {
        this.userDao = userDao;
    }

    @Override
    public User loginUser(String email, String password) throws SQLException, ServiceException {
        User user = userDao.findByEmail(email);

        if (user == null) {
            throw new ServiceException("Invalid Login!");
        }
        String decryptedPassword = new PassEncrypt().decrypt(user.getPassword());
        if (!decryptedPassword.equals(password)) {
            throw new ServiceException("Invalid Login!");
        }

        return user;
    }
}
