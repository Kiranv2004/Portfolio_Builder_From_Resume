package com.resume.portfolio.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "portfolios")
public class Portfolio {
    @Id
    private String id;

    @Indexed
    private String userId;

    @Indexed(unique = true)
    private String username; // For public URL

    private String theme; // e.g., "modern", "minimal"

    @com.fasterxml.jackson.annotation.JsonProperty("isPublic")
    private boolean isPublic;

    private PortfolioContent content;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    public static class PortfolioContent {
        private String theme; // Theme setting (modern, minimal, creative)
        private String about;
        private String profileImage;
        private List<Resume.Experience> experience;
        private List<Resume.Education> education;
        private List<Resume.Project> projects;
        private List<String> skills;
        private List<String> certifications;
        private List<String> languages;
        private List<String> awards;
        private ContactInfo contact;
    }

    @Data
    public static class ContactInfo {
        private String email;
        private String linkedin;
        private String github;
        private String twitter;
    }
}
