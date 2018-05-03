package com.codecool.web.service;

import org.jasypt.util.text.StrongTextEncryptor;

public class PassEncrypt {

    private StrongTextEncryptor textEncryptor = new StrongTextEncryptor();

    public PassEncrypt() {
        textEncryptor.setPassword("Sandwich");
    }

    public String encrypt(String pass) {
        return textEncryptor.encrypt(pass);
    }

    public String decrypt(String pass) {
        return textEncryptor.decrypt(pass);
    }
}