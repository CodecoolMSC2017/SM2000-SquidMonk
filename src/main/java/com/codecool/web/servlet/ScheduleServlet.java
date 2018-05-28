package com.codecool.web.servlet;

import com.codecool.web.dao.ColumnDao;
import com.codecool.web.dao.ScheduleDao;
import com.codecool.web.dao.implementation.ColumnDaoImpl;
import com.codecool.web.dao.implementation.ScheduleDaoImpl;
import com.codecool.web.dto.MessageDto;
import com.codecool.web.dto.ScheduleDto;
import com.codecool.web.service.ScheduleService;
import com.codecool.web.service.exception.ServiceException;
import com.codecool.web.service.jsService.JsScheduleService;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

@WebServlet("/protected/schedule/*")
public class ScheduleServlet extends AbstractServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try (Connection connection = getConnection(req.getServletContext())) {
            ScheduleService scheduleService = new JsScheduleService(connection);

            int scheduleId = getScheduleId(req.getRequestURI());
            ScheduleDto scheduleDto = scheduleService.fillScheduleDto(scheduleId);
            sendMessage(resp, HttpServletResponse.SC_OK, scheduleDto);
        } catch (SQLException e) {
            handleSqlError(resp, e);
        } catch (ServiceException e) {
            sendMessage(resp, HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try (Connection connection = getConnection(req.getServletContext())) {
            ScheduleService scheduleService = new JsScheduleService(connection);

            int scheduleId = getScheduleId(req.getRequestURI());
            String columnName = req.getParameter("columnName");
            scheduleService.addNewColumnToSchedule(scheduleId, columnName);

            ScheduleDto scheduleDto = scheduleService.fillScheduleDto(scheduleId);
            resp.setStatus(HttpServletResponse.SC_OK);
            sendMessage(resp, HttpServletResponse.SC_OK, scheduleDto);

        } catch (SQLException e) {
            handleSqlError(resp, e);
        } catch (ServiceException e) {
            sendMessage(resp, HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        try (Connection connection = getConnection(req.getServletContext())) {
            ScheduleService scheduleService = new JsScheduleService(connection);

            int scheduleId = getScheduleId(req.getRequestURI());
            scheduleService.deleteSchedule(scheduleId);

            resp.setStatus(HttpServletResponse.SC_OK);
        } catch (SQLException e) {
            handleSqlError(resp, e);
        } catch (ServiceException e) {
            sendMessage(resp, HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
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
        } catch (SQLException e) {
            handleSqlError(resp, e);
        } catch (ServiceException e) {
            sendMessage(resp, HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
        }
    }

    private int getScheduleId(String uri) throws ServiceException {
        String[] splitUri = uri.split("/");
        if (splitUri.length < 5) {
            throw new ServiceException("Missing schedule id");
        }
        String idAsString = splitUri[4];
        try {
            return Integer.parseInt(idAsString);
        } catch (NumberFormatException e) {
            throw new ServiceException("Schedule id is not a valid number");
        }
    }
}
