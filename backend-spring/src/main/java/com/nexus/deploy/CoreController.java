package com.nexus.deploy;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/core")
public class CoreController {

    @GetMapping("/info")
    public Map<String, Object> getCoreInfo() {
        Map<String, Object> response = new HashMap<>();
        response.put("service", "Core Backend (Spring Boot)");
        response.put("status", "HEALTHY");
        response.put("timestamp", LocalDateTime.now());
        response.put("version", "v1.0.0");
        
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("uptime", "99.9%");
        metrics.put("active_threads", Thread.activeCount());
        response.put("metrics", metrics);
        
        return response;
    }
}
