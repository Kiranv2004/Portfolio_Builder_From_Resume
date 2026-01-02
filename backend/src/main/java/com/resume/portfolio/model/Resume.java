package com.resume.portfolio.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Document(collection = "resumes")
public class Resume {
    @Id
    private String id;

    @Indexed
    private String userId;

    private String originalFileName;
    private String fileUrl;
    private String fileType;

    private ParsedResumeData parsedData;

    private boolean isUsedInPortfolio;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    public static class ParsedResumeData {
        private String name;
        private String email;
        private String phone;
        private String summary;
        private List<String> skills;
        private List<Experience> experience;
        private List<Education> education;
        private List<Project> projects;
        private List<String> certifications;
        private List<String> languages;
        private List<String> awards;
    }

    @Data
    public static class Experience {
        private String title;
        private String company;
        private String startDate;
        private String endDate;
        private String description;
    }

    @Data
    public static class Education {
        private String degree;
        private String school;
        private String startDate;
        private String endDate;
    }

    @Data
    public static class Project {
        private String name;
        private String description;
        private String url;
        private String imageUrl;
    }
}
