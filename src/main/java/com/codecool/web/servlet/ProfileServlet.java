package com.codecool.web.servlet;

import com.codecool.web.dao.UserDao;
import com.codecool.web.dao.implementation.UserDaoImpl;
import com.codecool.web.model.User;
import com.codecool.web.service.exception.ServiceException;
import com.codecool.web.service.jsService.JsProfileService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

@WebServlet("/protected/profile/user/*")
public class ProfileServlet extends AbstractServlet {

    private static final Logger logger = LoggerFactory.getLogger(ProfileServlet.class);

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        logger.debug("get method start");
        User user = (User) req.getSession().getAttribute("user");
        int userId = user.getId();
        try (Connection connection = getConnection(req.getServletContext())) {
            UserDao userDao = new UserDaoImpl(connection);
            JsProfileService profileService = new JsProfileService(userDao);
            User getUser = profileService.showDataByUserId(userId);
            req.getSession().setAttribute("user", getUser);
            sendMessage(resp, HttpServletResponse.SC_OK, getUser);
            logger.debug("get method successful");
        } catch (SQLException e) {
            handleSqlError(resp, e);
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        logger.debug("put method start");
        User user = (User) req.getSession().getAttribute("user");
        try (Connection connection = getConnection(req.getServletContext())) {
            UserDao userDao = new UserDaoImpl(connection);
            JsProfileService profileService = new JsProfileService(userDao);

            int userId = user.getId();
            String name = req.getParameter("name");
            String email = req.getParameter("email");

            if (name != null) {
                profileService.changeUserName(userId, name);
            }
            if (email != null) {
                profileService.changeUserEmail(userId, email);
            }

            resp.setStatus(HttpServletResponse.SC_OK);
            logger.debug("put method successful");
        } catch (SQLException e) {
            handleSqlError(resp, e);
        } catch (ServiceException e) {
            sendMessage(resp, HttpServletResponse.SC_BAD_REQUEST, e);
        }
    }
}