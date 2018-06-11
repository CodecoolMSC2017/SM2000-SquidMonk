package com.codecool.web.dao.implementation;

import com.codecool.web.dao.TaskDao;
import com.codecool.web.model.Task;
import org.junit.jupiter.api.Test;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class TaskDaoImplTest extends AbstractTest {

    // execution order: 2 1 6 5 3 4

    /*
    @Test
        // 1
    void findById() throws SQLException {
        try (Connection connection = getConnection()) {
            TaskDao taskDao = new TaskDaoImpl(connection);

            Task task1 = taskDao.findById(1);
            Task task2 = taskDao.findById(2);
            Task task3 = taskDao.findById(10);

            assertEquals("Clean toilet", task1.getName());
            assertEquals("It really needs cleaning!", task1.getContent());

            assertEquals("Take out the trash", task2.getName());
            assertEquals("So much....", task2.getContent());

            assertEquals("Learn PHP", task3.getName());
            assertEquals("", task3.getContent());
        }
    }

    @Test
        // 2
    void findAllByUserId() throws SQLException {
        resetDatabase();
        try (Connection connection = getConnection()) {
            TaskDao taskDao = new TaskDaoImpl(connection);

            List<Task> tasks = taskDao.findAllByUserId(4);

            assertEquals(4, tasks.size());
            assertEquals("Clean toilet", tasks.get(0).getName());
            assertEquals("Take out the trash", tasks.get(1).getName());
            assertEquals("Level up my paladin to 100", tasks.get(2).getName());
            assertEquals("Do laundry", tasks.get(3).getName());
        }
    }

    @Test
        // 3
    void insertTask() throws SQLException {
        try (Connection connection = getConnection()) {
            TaskDao taskDao = new TaskDaoImpl(connection);

            int id = 213;
            String name = "Csba Task 4";
            String content = "Content";

            taskDao.insertTask(4, name, content);

            List<Task> tasksAgain = taskDao.findAllByUserId(4);
            assertEquals(id, tasksAgain.get(4).getId());
            assertEquals(name, tasksAgain.get(4).getName());
            assertEquals(content, tasksAgain.get(4).getContent());
        }
    }

    @Test
        // 4
    void deleteTask() throws SQLException {
        try (Connection connection = getConnection()) {
            TaskDao taskDao = new TaskDaoImpl(connection);

            int id = 27;

            Task task = taskDao.findById(id);
            assertEquals("Mop", task.getName());

            taskDao.deleteTask(id);
            assertNull(taskDao.findById(id));
        }
    }

    @Test
        // 5
    void updateName() throws SQLException {
        try (Connection connection = getConnection()) {
            TaskDao taskDao = new TaskDaoImpl(connection);

            int id = 20;
            String name = "Bence Task update";

            Task task = taskDao.findById(id);
            assertEquals("Call mom", task.getName());

            taskDao.updateName(id, name);
            Task taskUpdateName = taskDao.findById(id);
            assertEquals("Bence Task update", taskUpdateName.getName());
        }
    }

    @Test
        // 6
    void updateContent() throws SQLException {
        try (Connection connection = getConnection()) {
            TaskDao taskDao = new TaskDaoImpl(connection);

            int id = 21;
            String content = "ContentUpdate";

            Task task = taskDao.findById(id);
            assertEquals("", task.getContent());

            taskDao.updateContent(id, content);
            Task taskUpdateContent = taskDao.findById(id);
            assertEquals("ContentUpdate", taskUpdateContent.getContent());
        }
    }
    /
    */
}
