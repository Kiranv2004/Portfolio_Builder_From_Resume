package com.resume.portfolio.controller;

import com.resume.portfolio.model.Portfolio;
import com.resume.portfolio.service.PortfolioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/p")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PublicPortfolioController {

    @Autowired
    private PortfolioService portfolioService;

    @GetMapping("/{username}")
    public ResponseEntity<?> getPublicPortfolio(@PathVariable String username) {
        try {
            Portfolio portfolio = portfolioService.getPublicPortfolio(username);
            return ResponseEntity.ok(portfolio);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
