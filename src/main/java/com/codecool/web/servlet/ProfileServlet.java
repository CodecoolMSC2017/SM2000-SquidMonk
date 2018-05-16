package com.codecool.web.servlet;

import com.codecool.web.dao.UserDao;
import com.codecool.web.dao.implementation.UserDaoImpl;
import com.codecool.web.model.User;
import com.codecool.web.service.exception.ServiceException;
import com.codecool.web.service.jsService.JsProfileService;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

@WebServlet("/protected/profile/user/*")
public class ProfileServlet extends AbstractServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        User user = (User) req.getSession().getAttribute("user");
        int userId = user.getId();
        try (Connection connection = getConnection(req.getServletContext())) {
            UserDao userDao = new UserDaoImpl(connection);
            JsProfileService profileService = new JsProfileService(userDao);
            profileService.showDataByUserId(userId);
            sendMessage(resp, HttpServletResponse.SC_OK, user);

        } catch (SQLException e) {
            handleSqlError(resp, e);
        } catch (ServiceException ex) {
            sendMessage(resp, HttpServletResponse.SC_UNAUTHORIZED, ex.getMessage());
        }
    }
}