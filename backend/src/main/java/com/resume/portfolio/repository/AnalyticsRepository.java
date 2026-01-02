package com.resume.portfolio.repository;

import com.resume.portfolio.model.Analytics;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface AnalyticsRepository extends MongoRepository<Analytics, String> {
    List<Analytics> findByPortfolioId(String portfolioId);

    long countByPortfolioId(String portfolioId);
}
