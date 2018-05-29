package com.codecool.web.dao;

import java.io.IOException;
import java.util.List;

public interface LogDao {

    List<String> readLog() throws IOException;
}
