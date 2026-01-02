package com.resume.portfolio.controller;

import com.resume.portfolio.model.Portfolio;
import com.resume.portfolio.service.PortfolioService;
import com.resume.portfolio.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/portfolio")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PortfolioController {

    @Autowired
    private PortfolioService portfolioService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/generate/{resumeId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> generatePortfolio(@PathVariable String resumeId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        String userId = userRepository.findByUsername(username).get().getId();

        try {
            Portfolio portfolio = portfolioService.generatePortfolioFromResume(userId, resumeId);
            return ResponseEntity.ok(portfolio);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getMyPortfolio() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        String userId = userRepository.findByUsername(username).get().getId();

        try {
            Portfolio portfolio = portfolioService.getPortfolioByUserId(userId);
            return ResponseEntity.ok(portfolio);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> updateMyPortfolio(@RequestBody Portfolio portfolioDetails) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        String userId = userRepository.findByUsername(username).get().getId();

        try {
            Portfolio portfolio = portfolioService.updatePortfolio(userId, portfolioDetails);
            return ResponseEntity.ok(portfolio);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/p/{username}")
    public ResponseEntity<?> getPublicPortfolio(@PathVariable String username) {
        try {
            Portfolio portfolio = portfolioService.getPublicPortfolio(username);
            return ResponseEntity.ok(portfolio);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
