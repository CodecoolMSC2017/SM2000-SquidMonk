package com.codecool.web.model;

public class Task {

    private final int id, userId;
    private int colId, schedId;
    private String name, content;
    private int start, end;

    public Task(int id, int userId, String name, String content) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.content = content;
    }

    // Getters
    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getContent() {
        return content;
    }

    public int getStart() {
        return start;
    }

    public int getEnd() {
        return end;
    }

    public int getColId() {
        return colId;
    }

    public int getSchedId() {
        return schedId;
    }

    public int getUserId() {
        return userId;
    }

    // Setters
    public void setName(String name) {
        this.name = name;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setStart(int start) {
        this.start = start;
    }

    public void setEnd(int end) {
        this.end = end;
    }

    public void setColId(int col_id) {
        this.colId = col_id;
    }

    public void setSchedId(int sched_id) {
        this.schedId = sched_id;
    }
}
