package com.codecool.web.servlet;

import com.codecool.web.dto.ScheduleDto;
import com.codecool.web.service.PassEncrypt;
import com.codecool.web.service.ScheduleService;
import com.codecool.web.service.exception.ServiceException;
import com.codecool.web.service.jsService.JsScheduleService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.jasypt.exceptions.EncryptionOperationNotPossibleException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

@WebServlet("/schedules/public/*")
public class SchedulesPublicServlet extends AbstractServlet {

    private static final Logger logger = LoggerFactory.getLogger(SchedulesPublicServlet.class);

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        logger.debug("get method start");
        try (Connection connection = getConnection(req.getServletContext())) {
            ScheduleService scheduleService = new JsScheduleService(connection);

            int scheduleId = getScheduleId(req.getRequestURI());
            ScheduleDto scheduleDto = scheduleService.fillScheduleDto(scheduleId);

            if (scheduleDto != null) {
                if (scheduleDto.isPublic()) {
                    req.setAttribute("scheduleJSON", new ObjectMapper().writeValueAsString(scheduleDto));
                    req.getRequestDispatcher("../../guest.jsp").forward(req, resp);
                } else {
                    sendMessage(resp, HttpServletResponse.SC_UNAUTHORIZED, "This schedule is not public.");
                }
                logger.debug("get method successful");
            } else {
                logger.debug("invalid schedule id");
                sendMessage(resp, HttpServletResponse.SC_BAD_REQUEST, "The schedule does not exist.");
            }
        } catch (SQLException e) {
            handleSqlError(resp, e);
        } catch (ServiceException e) {
            sendMessage(resp, HttpServletResponse.SC_BAD_REQUEST, e);
        }
    }

    private int getScheduleId(String uri) throws ServiceException {
        String encryptedId = null;
        String decryptedId = null;
        try {
            encryptedId = uri.substring(uri.lastIndexOf("public/") + 7);
            logger.debug("decrypting id " + encryptedId);
            decryptedId = new PassEncrypt().decrypt(encryptedId);
            logger.debug("decrypted id: " + decryptedId);
            return Integer.parseInt(decryptedId);
        } catch (EncryptionOperationNotPossibleException ex) {
            logger.debug(String.format("could not decrypt id %s", encryptedId));
            throw new ServiceException("Invalid schedule id");
        } catch (NumberFormatException e) {
            logger.debug(String.format("decrypted id %s is not a valid number", decryptedId));
            throw new ServiceException("Invalid schedule id");
        }
    }
}
