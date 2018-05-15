package com.codecool.web.servlet;

import com.codecool.web.dao.TaskDao;
import com.codecool.web.dao.implementation.TaskDaoImpl;
import com.codecool.web.model.Task;
import com.codecool.web.service.TaskService;
import com.codecool.web.service.exception.ServiceException;
import com.codecool.web.service.jsService.JsTaskService;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

@WebServlet("/protected/tasks/user/*")
public class TaskUserServlet extends AbstractServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try (Connection connection = getConnection(req.getServletContext())) {
            TaskDao taskDao = new TaskDaoImpl(connection);
            TaskService taskService = new JsTaskService(taskDao);

            int userId = getUserId(req.getRequestURI());
            List<Task> tasks = taskService.findAllByUserId(userId);
            sendMessage(resp, HttpServletResponse.SC_OK, tasks);
        } catch (SQLException e) {
            handleSqlError(resp, e);
        } catch (NumberFormatException e) {
            sendMessage(resp, HttpServletResponse.SC_BAD_REQUEST, "User id is not a valid number");
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try (Connection connection = getConnection(req.getServletContext())) {
            TaskDao taskDao = new TaskDaoImpl(connection);
            TaskService taskService = new JsTaskService(taskDao);

            String name = req.getParameter("name");
            String content = req.getParameter("content");
            int userId = getUserId(req.getRequestURI());

            taskService.insertTask(userId, name, content);
        } catch (SQLException e) {
            handleSqlError(resp, e);
        } catch (NumberFormatException e) {
            sendMessage(resp, HttpServletResponse.SC_BAD_REQUEST, "User id is not a valid number");
        } catch (ServiceException e) {
            sendMessage(resp, HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
        }
    }

    private int getUserId(String uri) throws NumberFormatException {
        String userIdAsString = uri.substring(uri.lastIndexOf("/") + 1);
        return Integer.parseInt(userIdAsString);
    }
}
