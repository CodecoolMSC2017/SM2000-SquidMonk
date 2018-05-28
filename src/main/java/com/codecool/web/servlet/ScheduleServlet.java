package com.codecool.web.servlet;

import com.codecool.web.dto.ScheduleDto;
import com.codecool.web.service.ScheduleService;
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
        String uri = req.getRequestURI();
        int schedId = Integer.parseInt(uri.substring(uri.lastIndexOf("/") + 1, uri.length()));

        try (Connection connection = getConnection(req.getServletContext())) {
            ScheduleService scheduleService = new JsScheduleService(connection);

            ScheduleDto scheduleDto = scheduleService.fillScheduleDto(schedId);
            sendMessage(resp, HttpServletResponse.SC_OK, scheduleDto);
        } catch (SQLException e) {
            handleSqlError(resp, e);
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        int schedId = Integer.parseInt(req.getParameter("scheduleId"));
        String columnName = req.getParameter("columnName");

        try (Connection connection = getConnection(req.getServletContext())) {
            ScheduleService scheduleService = new JsScheduleService(connection);

            scheduleService.addNewColumnToSchedule(schedId, columnName);

            ScheduleDto scheduleDto = scheduleService.fillScheduleDto(schedId);
            resp.setStatus(HttpServletResponse.SC_OK);
            sendMessage(resp, HttpServletResponse.SC_OK, scheduleDto);

        } catch (SQLException e) {
            handleSqlError(resp, e);
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        int schedId = Integer.parseInt(req.getParameter("scheduleId"));

        try (Connection connection = getConnection(req.getServletContext())) {
            ScheduleService scheduleService = new JsScheduleService(connection);

            scheduleService.deleteSchedule(schedId);

            resp.setStatus(HttpServletResponse.SC_OK);
            /*sendMessage(resp, HttpServletResponse.SC_OK);*/

        } catch (SQLException e) {
            handleSqlError(resp, e);
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String uri = req.getRequestURI();
        int schedId = Integer.parseInt(uri.substring(uri.lastIndexOf("/") + 1, uri.length()));
        try (Connection connection = getConnection(req.getServletContext())) {
            ScheduleDao scheduleDao = new ScheduleDaoImpl(connection);
            scheduleDao.updateVisibility(schedId);
        } catch (SQLException e) {
            handleSqlError(resp, e);
        }
    }
}
