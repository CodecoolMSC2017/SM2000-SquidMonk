package com.codecool.web.servlet;

import com.codecool.web.model.User;
import com.codecool.web.service.UsersService;
import com.codecool.web.service.exception.ServiceException;
import com.codecool.web.service.jsService.JsUsersService;

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

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        try (Connection connection = getConnection(req.getServletContext())) {
            UsersService usersService = new JsUsersService(connection);

            List<User> users = usersService.getUsers();
            sendMessage(resp, HttpServletResponse.SC_OK, users);

        } catch (SQLException e) {
            handleSqlError(resp, e);
        } catch (ServiceException e) {
            sendMessage(resp, HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
        }
    }
}
