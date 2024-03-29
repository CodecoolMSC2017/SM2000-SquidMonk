package com.codecool.web.servlet;

import com.codecool.web.dto.ScheduleDto;
import com.codecool.web.model.Task;
import com.codecool.web.model.User;
import com.codecool.web.service.ScheduleService;
import com.codecool.web.service.ScheduleTaskService;
import com.codecool.web.service.TaskService;
import com.codecool.web.service.exception.ServiceException;
import com.codecool.web.service.jsService.JsScheduleService;
import com.codecool.web.service.jsService.JsScheduleTaskService;
import com.codecool.web.service.jsService.JsTaskService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

@WebServlet("/protected/schedule/task/*")
public class ScheduleTaskServlet extends AbstractServlet {

    private static final Logger logger = LoggerFactory.getLogger(ScheduleTaskServlet.class);

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        logger.debug("get method start");
        try (Connection connection = getConnection(req.getServletContext())) {
            ScheduleTaskService service = new JsScheduleTaskService(connection);

            int scheduleId = Integer.parseInt(req.getParameter("scheduleId"));
            int taskId = getTaskId(req.getRequestURI());
            Task task = service.getFilledTask(taskId, scheduleId);
            sendMessage(resp, HttpServletResponse.SC_OK, task);
            logger.debug("get method successful");
        } catch (SQLException e) {
            handleSqlError(resp, e);
        } catch (ServiceException e) {
            sendMessage(resp, HttpServletResponse.SC_BAD_REQUEST, e);
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        logger.trace("post method start");
        try (Connection connection = getConnection(req.getServletContext())) {
            TaskService taskService = new JsTaskService(connection);
            ScheduleService scheduleService = new JsScheduleService(connection);

            int scheduleId = Integer.parseInt(req.getParameter("scheduleId"));
            int columnId = Integer.parseInt(req.getParameter("columnId"));
            String title = req.getParameter("title");
            String description = req.getParameter("description");
            int start = Integer.parseInt(req.getParameter("start"));
            int end = Integer.parseInt(req.getParameter("end"));

            HttpSession session = req.getSession();
            User user = (User) session.getAttribute("user");

            if (title.equals("")) {
                title = " ";
            }

            int taskId = taskService.insertTask(user.getId(), title, description);
            taskService.assignTask(taskId, columnId, scheduleId, start, end);

            ScheduleDto scheduleDto = scheduleService.fillScheduleDto(scheduleId);
            sendMessage(resp, HttpServletResponse.SC_OK, scheduleDto);
            logger.trace("post method successful");
        } catch (SQLException e) {
            sendMessage(resp, HttpServletResponse.SC_CONFLICT, e.getMessage());
        } catch (ServiceException e) {
            sendMessage(resp, HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        logger.debug("delete method start");
        try (Connection connection = getConnection(req.getServletContext())) {
            ScheduleTaskService service = new JsScheduleTaskService(connection);

            int scheduleId = Integer.parseInt(req.getParameter("scheduleId"));
            int taskId = getTaskId(req.getRequestURI());

            service.removeTaskFromSchedule(taskId, scheduleId);
            resp.setStatus(HttpServletResponse.SC_NO_CONTENT);
            logger.debug("delete method successful");
        } catch (SQLException e) {
            handleSqlError(resp, e);
        } catch (ServiceException e) {
            sendMessage(resp, HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        logger.debug("put method start");
        try (Connection connection = getConnection(req.getServletContext())) {
            TaskService taskService = new JsTaskService(connection);
            ScheduleService scheduleService = new JsScheduleService(connection);

            int scheduleId = Integer.parseInt(req.getParameter("scheduleId"));
            int taskId = getTaskId(req.getRequestURI());
            String title = req.getParameter("title");
            String description = req.getParameter("description");
            int start = Integer.parseInt(req.getParameter("start"));
            int end = Integer.parseInt(req.getParameter("end"));

            taskService.updateTask(taskId, scheduleId, title, description, start, end);

            ScheduleDto scheduleDto = scheduleService.fillScheduleDto(scheduleId);
            sendMessage(resp, HttpServletResponse.SC_OK, scheduleDto);
            logger.debug("put method successful");
        } catch (SQLException e) {
            logger.error("sql error", e);
            sendMessage(resp, HttpServletResponse.SC_CONFLICT, e.getMessage());
        } catch (ServiceException e) {
            sendMessage(resp, HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
        }
    }

    private int getTaskId(String uri) throws ServiceException {
        String[] splitUri = uri.split("/");
        if (splitUri.length < 6) {
            throw new ServiceException("Missing schedule id");
        }
        String idAsString = splitUri[5];
        try {
            logger.debug("getting task id from url: " + idAsString);
            return Integer.parseInt(idAsString);
        } catch (NumberFormatException e) {
            throw new ServiceException("Schedule id is not a valid number");
        }
    }
}
