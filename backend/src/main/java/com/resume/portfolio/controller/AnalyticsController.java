package com.resume.portfolio.controller;

import com.resume.portfolio.model.Analytics;
import com.resume.portfolio.model.Portfolio;
import com.resume.portfolio.repository.AnalyticsRepository;
import com.resume.portfolio.repository.PortfolioRepository;
import com.resume.portfolio.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AnalyticsController {

    @Autowired
    private AnalyticsRepository analyticsRepository;

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/summary")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getAnalyticsSummary() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        String userId = userRepository.findByUsername(username).get().getId();

        Portfolio portfolio = portfolioRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));

        // Get all analytics for this portfolio
        List<Analytics> allAnalytics = analyticsRepository.findByPortfolioId(portfolio.getId());

        // Calculate date range (last 7 days)
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        List<Analytics> recentAnalytics = allAnalytics.stream()
                .filter(a -> a.getTimestamp() != null && a.getTimestamp().isAfter(sevenDaysAgo))
                .collect(Collectors.toList());

        // Total views
        long totalViews = allAnalytics.size();
        long recentViews = recentAnalytics.size();

        // Unique visitors (based on IP)
        long uniqueVisitors = recentAnalytics.stream()
                .map(Analytics::getVisitorIp)
                .filter(Objects::nonNull)
                .distinct()
                .count();

        // Daily views for last 7 days
        Map<String, Long> dailyViews = new LinkedHashMap<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            String dayName = date.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);

            long viewsForDay = recentAnalytics.stream()
                    .filter(a -> a.getTimestamp().toLocalDate().equals(date))
                    .count();

            dailyViews.put(dayName, viewsForDay);
        }

        // Traffic sources (based on referer)
        Map<String, Long> trafficSources = recentAnalytics.stream()
                .map(a -> {
                    String referer = a.getReferer();
                    if (referer == null || referer.isEmpty() || referer.equals("direct")) {
                        return "Direct";
                    } else if (referer.contains("linkedin")) {
                        return "LinkedIn";
                    } else if (referer.contains("twitter") || referer.contains("t.co")) {
                        return "Twitter";
                    } else if (referer.contains("google") || referer.contains("bing")) {
                        return "Search";
                    } else {
                        return "Other";
                    }
                })
                .collect(Collectors.groupingBy(s -> s, Collectors.counting()));

        // Calculate percentage changes (comparing to previous 7 days)
        LocalDateTime fourteenDaysAgo = LocalDateTime.now().minusDays(14);
        long previousPeriodViews = allAnalytics.stream()
                .filter(a -> a.getTimestamp() != null &&
                        a.getTimestamp().isAfter(fourteenDaysAgo) &&
                        a.getTimestamp().isBefore(sevenDaysAgo))
                .count();

        double viewsChange = previousPeriodViews > 0
                ? ((double) (recentViews - previousPeriodViews) / previousPeriodViews) * 100
                : 0;

        Map<String, Object> response = new HashMap<>();
        response.put("totalViews", totalViews);
        response.put("recentViews", recentViews);
        response.put("uniqueVisitors", uniqueVisitors);
        response.put("viewsChange", String.format("%+.0f%%", viewsChange));
        response.put("dailyViews", dailyViews);
        response.put("trafficSources", trafficSources);
        response.put("portfolioId", portfolio.getId());

        return ResponseEntity.ok(response);
    }
}
