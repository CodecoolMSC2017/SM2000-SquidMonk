package com.codecool.web.listener;

import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ScriptUtils;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;
import javax.sql.DataSource;
import java.io.FileWriter;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

@WebListener
public final class WebappContextListener implements ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        registerCharacterEncodingFilter(sce);
        DataSource dataSource = putDataSourceToServletContext(sce);
        runDatabaseInitScript(dataSource);
        emptyLogFile();
    }

    private void registerCharacterEncodingFilter(ServletContextEvent sce) {
        sce.getServletContext().addFilter("SetCharacterEncodingFilter", "org.apache.catalina.filters.SetCharacterEncodingFilter");
    }

    private DataSource putDataSourceToServletContext(ServletContextEvent sce) {
        try {
            Context initCtx = new InitialContext();
            Context envCtx = (Context) initCtx.lookup("java:comp/env");
            DataSource dataSource = (DataSource) envCtx.lookup("jdbc/sm2000");
            ServletContext servletCtx = sce.getServletContext();
            servletCtx.setAttribute("dataSource", dataSource);
            return dataSource;
        } catch (NamingException ex) {
            ex.printStackTrace();
            throw new IllegalStateException(ex);
        }
    }

    private void runDatabaseInitScript(DataSource dataSource) {
        try (Connection connection = dataSource.getConnection()) {
            ScriptUtils.executeSqlScript(connection, new ClassPathResource("/init.sql"));
        } catch (SQLException ex) {
            ex.printStackTrace();
            throw new IllegalStateException(ex);
        }
    }

    private void emptyLogFile() {
        try {
            new FileWriter("/tmp/squidmonk.log").close();
        } catch (IOException e) {
            e.printStackTrace();
            throw new IllegalStateException(e);
        }
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {

    }
}
