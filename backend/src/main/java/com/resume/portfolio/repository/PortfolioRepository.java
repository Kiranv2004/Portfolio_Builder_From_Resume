package com.resume.portfolio.repository;

import com.resume.portfolio.model.Portfolio;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface PortfolioRepository extends MongoRepository<Portfolio, String> {
    Optional<Portfolio> findByUserId(String userId);

    Optional<Portfolio> findByUsername(String username);
}
