package com.resume.portfolio.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Set;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;

    @Indexed(unique = true)
    private String username;

    @Indexed(unique = true)
    private String email;

    private String password;

    private String fullName;

    private String bio;

    private Set<String> roles;

    private UserProfile profile;

    @Data
    public static class UserProfile {
        private String name;
        private String headline;
        private String location;
        private String avatarUrl;
        private String bio;
    }
}
