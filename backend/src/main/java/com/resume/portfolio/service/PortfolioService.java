package com.resume.portfolio.service;

import com.resume.portfolio.model.Portfolio;
import com.resume.portfolio.model.Resume;
import com.resume.portfolio.model.User;
import com.resume.portfolio.repository.PortfolioRepository;
import com.resume.portfolio.repository.ResumeRepository;
import com.resume.portfolio.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Service
public class PortfolioService {

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private UserRepository userRepository;

    public Portfolio generatePortfolioFromResume(String userId, String resumeId) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        if (!resume.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to resume");
        }

        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        System.out.println("Generating portfolio for user: " + user.getUsername() + " (ID: " + userId + ")");

        Portfolio portfolio = portfolioRepository.findByUserId(userId).orElse(new Portfolio());
        portfolio.setUserId(userId);
        portfolio.setUsername(user.getUsername());
        System.out.println("Setting portfolio username to: " + user.getUsername());

        portfolio.setTheme("modern"); // Default theme
        portfolio.setPublic(false);

        if (portfolio.getCreatedAt() == null) {
            portfolio.setCreatedAt(LocalDateTime.now());
        }
        portfolio.setUpdatedAt(LocalDateTime.now());

        Portfolio.PortfolioContent content = new Portfolio.PortfolioContent();
        content.setTheme("modern"); // Set theme in content as well
        content.setAbout(resume.getParsedData().getSummary());
        content.setExperience(resume.getParsedData().getExperience());
        content.setEducation(resume.getParsedData().getEducation());
        content.setProjects(resume.getParsedData().getProjects());
        content.setSkills(resume.getParsedData().getSkills());
        content.setCertifications(resume.getParsedData().getCertifications());
        content.setLanguages(resume.getParsedData().getLanguages());
        content.setAwards(resume.getParsedData().getAwards());

        Portfolio.ContactInfo contact = new Portfolio.ContactInfo();
        contact.setEmail(resume.getParsedData().getEmail());
        // TODO: Extract social links if available in resume or user profile
        content.setContact(contact);

        portfolio.setContent(content);

        Portfolio saved = portfolioRepository.save(portfolio);
        System.out.println("Saved portfolio. ID: " + saved.getId() + ", Username: " + saved.getUsername());
        return saved;
    }

    public Portfolio getPortfolioByUserId(String userId) {
        System.out.println("Fetching portfolio for user ID: " + userId);
        Portfolio p = portfolioRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));
        System.out.println("Found portfolio. Username field: " + p.getUsername());
        return p;
    }

    public Portfolio updatePortfolio(String userId, Portfolio portfolioDetails) {
        Portfolio portfolio = getPortfolioByUserId(userId);
        portfolio.setContent(portfolioDetails.getContent());
        portfolio.setTheme(portfolioDetails.getTheme());
        portfolio.setPublic(portfolioDetails.isPublic());
        portfolio.setUpdatedAt(LocalDateTime.now());
        System.out.println("Updating portfolio. New public status: " + portfolio.isPublic());
        return portfolioRepository.save(portfolio);
    }

    public Portfolio getPublicPortfolio(String username) {
        System.out.println("Fetching public portfolio for: " + username);
        Portfolio portfolio = portfolioRepository.findByUsername(username)
                .orElseThrow(() -> {
                    System.out.println("Portfolio not found for username: " + username);
                    return new RuntimeException("Portfolio not found");
                });

        System.out.println("Found portfolio for " + username + ". isPublic: " + portfolio.isPublic());
        if (!portfolio.isPublic()) {
            System.out.println("Portfolio IS PRIVATE for " + username);
            throw new RuntimeException("Portfolio is private");
        }
        return portfolio;
    }
}
