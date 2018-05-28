package com.codecool.web.servlet;

import com.codecool.web.dto.ScheduleDto;
import com.codecool.web.service.PassEncrypt;
import com.codecool.web.service.ScheduleService;
import com.codecool.web.service.jsService.JsScheduleService;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

@WebServlet("/schedules/public/*")
public class UrlServlet extends AbstractServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String uri = req.getRequestURI();
        String scheduleUrl = uri.substring(uri.lastIndexOf("public/") + 7, uri.length());
        int scheduleId = Integer.parseInt(new PassEncrypt().decrypt(scheduleUrl));
        try (Connection connection = getConnection(req.getServletContext())) {
            ScheduleService scheduleService = new JsScheduleService(connection);

            ScheduleDto scheduleDto = scheduleService.fillScheduleDto(scheduleId);
            if (scheduleDto.isPublic()) {
                req.setAttribute("asd", scheduleDto.getUrl());
                req.getRequestDispatcher("guest.html").include(req, resp);
            } else {
                sendMessage(resp, HttpServletResponse.SC_UNAUTHORIZED, null);
            }
        } catch (SQLException e) {
            handleSqlError(resp, e);
        }
    }
}
