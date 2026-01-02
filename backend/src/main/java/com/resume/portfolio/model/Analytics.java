package com.resume.portfolio.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "analytics")
public class Analytics {
    @Id
    private String id;

    @Indexed
    private String portfolioId;

    private String visitorIp;
    private String userAgent;
    private String referer;

    private LocalDateTime timestamp;
}
