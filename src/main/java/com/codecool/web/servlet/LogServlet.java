package com.codecool.web.servlet;

import com.codecool.web.dao.LogDao;
import com.codecool.web.dao.local.LogDaoLocal;
import com.codecool.web.dto.LogDto;
import com.codecool.web.service.LogService;
import com.codecool.web.service.exception.ServiceException;
import com.codecool.web.service.jsService.JsLogService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/protected/logview/*")
public class LogServlet extends AbstractServlet {

    private static final Logger logger = LoggerFactory.getLogger(LogServlet.class);

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        logger.debug("get method start");
        LogDao logDao = new LogDaoLocal();
        LogService logService = new JsLogService(logDao);
        LogDto logDto = null;

        try {
            String mode = getRequestMode(req.getRequestURI());

            if (mode.equals("pageload")) {
                logDto = logService.readLastLinesFromLog(100);
            }
            else if (mode.equals("filter")) {
                String servlets = req.getParameterValues("servlets")[0];
                String logLevels = req.getParameterValues("loglevels")[0];

                logDto = logService.getFilteredData(servlets.split(","), logLevels.split(","));
            }

            sendMessage(resp, HttpServletResponse.SC_OK, logDto);
            logger.debug("get method successful");

        } catch (ServiceException e) {
            sendMessage(resp, HttpServletResponse.SC_BAD_REQUEST, e);
        }
    }

    private String getRequestMode(String uri) throws ServiceException {
        String[] splitUri = uri.split("/");
        if (splitUri.length < 5) {
            throw new ServiceException("Missing mode selector");
        }
        String mode = splitUri[4];
        logger.debug("getting get request mode from url: " + mode);

        return mode;
    }

}
