package com.codecool.web.servlet;

import com.codecool.web.dto.MessageDto;
import com.codecool.web.dto.ScheduleDto;
import com.codecool.web.service.ScheduleService;
import com.codecool.web.service.exception.ServiceException;
import com.codecool.web.service.jsService.JsScheduleService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

@WebServlet("/protected/schedule/*")
public class ScheduleServlet extends AbstractServlet {

    private static final Logger logger = LoggerFactory.getLogger(ScheduleServlet.class);

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        logger.debug("get method start");
        try (Connection connection = getConnection(req.getServletContext())) {
            ScheduleService scheduleService = new JsScheduleService(connection);

            int scheduleId = getScheduleId(req.getRequestURI());
            ScheduleDto scheduleDto = scheduleService.fillScheduleDto(scheduleId);
            sendMessage(resp, HttpServletResponse.SC_OK, scheduleDto);
            logger.debug("get method successful");
        } catch (SQLException e) {
            handleSqlError(resp, e);
        } catch (ServiceException e) {
            sendMessage(resp, HttpServletResponse.SC_BAD_REQUEST, e);
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        logger.debug("post method start");
        try (Connection connection = getConnection(req.getServletContext())) {
            ScheduleService scheduleService = new JsScheduleService(connection);

            int scheduleId = getScheduleId(req.getRequestURI());
            String columnName = req.getParameter("columnName");
            scheduleService.addNewColumnToSchedule(scheduleId, columnName);

            ScheduleDto scheduleDto = scheduleService.fillScheduleDto(scheduleId);
            sendMessage(resp, HttpServletResponse.SC_OK, scheduleDto);
            logger.debug("post method successful");
        } catch (SQLException e) {
            handleSqlError(resp, e);
        } catch (ServiceException e) {
            sendMessage(resp, HttpServletResponse.SC_BAD_REQUEST, e);
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        logger.debug("delete method start");
        try (Connection connection = getConnection(req.getServletContext())) {
            ScheduleService scheduleService = new JsScheduleService(connection);

            int scheduleId = getScheduleId(req.getRequestURI());
            scheduleService.deleteSchedule(scheduleId);

            resp.setStatus(HttpServletResponse.SC_OK);
            logger.debug("delete method successful");
        } catch (SQLException e) {
            handleSqlError(resp, e);
        } catch (ServiceException e) {
            sendMessage(resp, HttpServletResponse.SC_BAD_REQUEST, e);
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        logger.debug("put method start");
        try (Connection connection = getConnection(req.getServletContext())) {
            ScheduleService scheduleService = new JsScheduleService(connection);

            int scheduleId = getScheduleId(req.getRequestURI());

            if (req.getRequestURI().endsWith("/visible")) {
                scheduleService.updateVisibility(scheduleId);

                String visibility = String.valueOf(scheduleService.getVisibility(scheduleId));
                MessageDto messageDto = new MessageDto(visibility);
                sendMessage(resp, HttpServletResponse.SC_OK, messageDto);
            } else {

                String columnNewName = req.getParameter("columnName");
                int columnId = Integer.parseInt(req.getParameter("columnId"));
                scheduleService.updateColumnName(columnId, columnNewName);

                ScheduleDto scheduleDto = scheduleService.fillScheduleDto(scheduleId);
                sendMessage(resp, HttpServletResponse.SC_OK, scheduleDto);
            }
            logger.debug("put method successful");
        } catch (SQLException e) {
            handleSqlError(resp, e);
        } catch (ServiceException e) {
            sendMessage(resp, HttpServletResponse.SC_BAD_REQUEST, e);
        }
    }

    private int getScheduleId(String uri) throws ServiceException {
        String[] splitUri = uri.split("/");
        if (splitUri.length < 5) {
            throw new ServiceException("Missing schedule id");
        }
        String idAsString = splitUri[4];
        try {
            logger.debug("getting schedule id from url: " + idAsString);
            return Integer.parseInt(idAsString);
        } catch (NumberFormatException e) {
            throw new ServiceException("Schedule id is not a valid number");
        }
    }
}
