package com.codecool.web.servlet;

import com.codecool.web.dao.LogDao;
import com.codecool.web.dao.local.LogDaoLocal;
import com.codecool.web.dto.LogDto;
import com.codecool.web.service.LogService;
import com.codecool.web.service.jsService.JsLogService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/protected/logview")
public class LogServlet extends AbstractServlet {

    private static final Logger logger = LoggerFactory.getLogger(LogServlet.class);

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        logger.debug("get method start");
        LogDao logDao = new LogDaoLocal();
        LogService logService = new JsLogService(logDao);

        LogDto logDto = logService.readFullLog();

        sendMessage(resp, HttpServletResponse.SC_OK, logDto);
        logger.debug("get method successful");
    }
}
