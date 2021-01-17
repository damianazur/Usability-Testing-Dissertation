package com.disazure.usabcheck;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MainController {
    @GetMapping("/api/helloo")
    public String hello() {
        return "Rest point accessed!!!";
    }
}
