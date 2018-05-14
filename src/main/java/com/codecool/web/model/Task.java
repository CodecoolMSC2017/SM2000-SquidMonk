package com.codecool.web.model;

public class Task {

    private final int id;
    private int col_id, sched_id;
    private String name, content;
    private int start, end;

    public Task(int id, String name, String content) {
        this.id = id;
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

    public int getCol_id() {
        return col_id;
    }

    public int getSched_id() {
        return sched_id;
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

    public void setCol_id(int col_id) {
        this.col_id = col_id;
    }

    public void setSched_id(int sched_id) {
        this.sched_id = sched_id;
    }
}
