package com.codecool.web.servlet;

import com.codecool.web.dao.TaskDao;
import com.codecool.web.dao.implementation.TaskDaoImpl;
import com.codecool.web.model.Task;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

@WebServlet("/protected/tasks/user/*")
public class TaskUserServlet  extends AbstractServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String uri = req.getRequestURI();
        String userId = uri.substring(uri.lastIndexOf("/") + 1, uri.length());
        try (Connection connection = getConnection(req.getServletContext())) {
            TaskDao taskDao = new TaskDaoImpl(connection);
            List<Task> taskList = taskDao.findAllByUserId(Integer.parseInt(userId));
            resp.setStatus(HttpServletResponse.SC_OK);
            sendMessage(resp, HttpServletResponse.SC_OK, taskList);
        } catch (SQLException e) {
            handleSqlError(resp, e);
        }
    }
}
