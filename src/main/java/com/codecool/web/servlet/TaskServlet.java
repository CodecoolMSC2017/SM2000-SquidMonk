package com.codecool.web.servlet;

import com.codecool.web.dao.TaskDao;
import com.codecool.web.dao.implementation.TaskDaoImpl;
import com.codecool.web.service.TaskService;
import com.codecool.web.service.jsService.JsTaskService;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

@WebServlet("/protected/tasks/*")
public class TaskServlet extends AbstractServlet {

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try (Connection connection = getConnection(req.getServletContext())) {
            TaskDao taskDao = new TaskDaoImpl(connection);
            TaskService taskService = new JsTaskService(taskDao);

            String newName = req.getParameter("name");
            String newContent = req.getParameter("content");
            int taskId = getTaskId(req.getRequestURI());

            taskService.updateTask(taskId, newName, newContent);
        } catch (SQLException e) {
            handleSqlError(resp, e);
        } catch (NumberFormatException e) {
            sendMessage(resp, HttpServletResponse.SC_BAD_REQUEST, "Task id is not a valid number");
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try (Connection connection = getConnection(req.getServletContext())) {
            TaskDao taskDao = new TaskDaoImpl(connection);
            TaskService taskService = new JsTaskService(taskDao);

            int taskId = getTaskId(req.getRequestURI());

            taskService.deleteTask(taskId);
        } catch (SQLException e) {
            handleSqlError(resp, e);
        } catch (NumberFormatException e) {
            sendMessage(resp, HttpServletResponse.SC_BAD_REQUEST, "Task id is not a valid number");
        }
    }

    private int getTaskId(String uri) throws NumberFormatException {
        String taskIdAsString = uri.substring(uri.lastIndexOf("/") + 1);
        return Integer.parseInt(taskIdAsString);
    }
}
