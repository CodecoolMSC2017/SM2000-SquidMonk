package com.codecool.web.service;

import java.io.IOException;
import java.util.List;

public interface LogService {

    List<String> readLog() throws IOException;
}
