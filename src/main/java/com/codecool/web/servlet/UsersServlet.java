package com.codecool.web.servlet;

import com.codecool.web.model.User;
import com.codecool.web.service.UsersService;
import com.codecool.web.service.exception.ServiceException;
import com.codecool.web.service.jsService.JsUsersService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

@WebServlet("/protected/users")
public class UsersServlet extends AbstractServlet {

    private static final Logger logger = LoggerFactory.getLogger(UsersServlet.class);

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        logger.trace("get method start");
        try (Connection connection = getConnection(req.getServletContext())) {
            UsersService usersService = new JsUsersService(connection);

            List<User> users = usersService.getUsers();
            sendMessage(resp, HttpServletResponse.SC_OK, users);
            logger.trace("get method successful");
        } catch (SQLException e) {
            handleSqlError(resp, e);
        } catch (ServiceException e) {
            sendMessage(resp, HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
        }
    }
}
