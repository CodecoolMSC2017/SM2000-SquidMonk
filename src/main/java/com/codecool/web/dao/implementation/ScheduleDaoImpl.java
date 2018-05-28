package com.codecool.web.dao.implementation;

import com.codecool.web.dao.ScheduleDao;
import com.codecool.web.dto.DashboardScheduleDto;
import com.codecool.web.model.Schedule;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ScheduleDaoImpl extends AbstractDao implements ScheduleDao {

    private final String querySchedules = "SELECT id, name, is_public FROM schedules ";

    public ScheduleDaoImpl(Connection connection) {
        super(connection);
    }

    @Override
    public Schedule findById(int id) throws SQLException {
        String sql = querySchedules + "WHERE id = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, id);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    return fetchSchedule(resultSet);
                }
            }
        }
        return null;
    }

    @Override
    public List<Schedule> findAllByUserId(int userId) throws SQLException {
        List<Schedule> schedules = new ArrayList<>();
        String sql = querySchedules + "WHERE user_id = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, userId);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    schedules.add(fetchSchedule(resultSet));
                }
            }
        }
        return schedules;
    }

    @Override
    public void insertSchedule(int userId, String name) throws SQLException {
        String sql = "INSERT INTO schedules (user_id, name) VALUES (?, ?) ";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, userId);
            statement.setString(2, name);
            executeInsert(statement);
        }
    }

    @Override
    public void updateVisibility(int scheduleId) throws SQLException {
        String sql = "UPDATE schedules SET is_public = NOT is_public WHERE id=?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, scheduleId);
            executeInsert(statement);
        }
    }

    @Override
    public void updateName(int scheduleId, String name) throws SQLException {
        String sql = "UPDATE schedules SET name = ? WHERE id = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, name);
            statement.setInt(2, scheduleId);
            executeInsert(statement);
        }
    }

    @Override
    public void deleteSchedule(int scheduleId) throws SQLException {
        String sql = "DELETE FROM schedules WHERE id=?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, scheduleId);
            executeInsert(statement);
        }
    }

    public List<DashboardScheduleDto> findUserDashboardSchedules(int userId) throws SQLException {
        List<DashboardScheduleDto> dbSchedDtoList = new ArrayList<>();
        String sql = "SELECT schedules.id, schedules.name, schedules.is_public, COUNT(task_id)\n" +
                "FROM schedules LEFT JOIN col_tsk ON schedules.id = col_tsk.schedule_id\n" +
                "WHERE schedules.user_id = ? GROUP BY schedules.id " +
                "ORDER BY schedules.id DESC";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, userId);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    dbSchedDtoList.add(fetchDashboardDto(resultSet));
                }
            }
        }
        return dbSchedDtoList;
    }

    @Override
    public Map<Integer, String> findAllByTaskId(int taskId) throws SQLException {
        Map<Integer, String> schedules = new HashMap<>();
        String sql = "SELECT id, name FROM col_tsk " +
                "LEFT JOIN schedules ON id = schedule_id " +
                "WHERE task_id = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, taskId);
            try (ResultSet resultSet = statement.executeQuery()) {
                String name;
                Integer id;
                while (resultSet.next()) {
                    id = resultSet.getInt("id");
                    name = resultSet.getString("name");
                    schedules.put(id, name);
                }
            }
        }
        return schedules;
    }

    @Override
    public List<Integer> getSchedulesOfTask(int userId, int taskId) throws SQLException {
        // schedule id : task ids
        List<Integer> schedules = new ArrayList<>();
        String sql = "SELECT id, task_id FROM schedules " +
                "JOIN col_tsk ON id = schedule_id " +
                "WHERE user_id = ? AND task_id = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, userId);
            statement.setInt(2, taskId);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    schedules.add(resultSet.getInt("id"));
                }
            }
        }
        return schedules;
    }

    private DashboardScheduleDto fetchDashboardDto(ResultSet resultSet) throws SQLException {
        int id = resultSet.getInt("id");
        String name = resultSet.getString("name");
        boolean isPublic = resultSet.getBoolean("is_public");
        int numOfTasks = resultSet.getInt("count");
        return new DashboardScheduleDto(id, numOfTasks, name, isPublic);
    }

    private Schedule fetchSchedule(ResultSet resultSet) throws SQLException {
        int id = resultSet.getInt("id");
        String name = resultSet.getString("name");
        boolean isPublic = resultSet.getBoolean("is_public");

        Schedule schedule = new Schedule(id, name);

        if (isPublic) {
            schedule.setPublic();
        }
        return schedule;
    }
}
