package com.resume.portfolio.controller;

import com.resume.portfolio.model.Resume;
import com.resume.portfolio.repository.ResumeRepository;
import com.resume.portfolio.service.FileStorageService;
import com.resume.portfolio.service.ResumeParserService;
import com.resume.portfolio.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/resumes")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ResumeController {

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private ResumeParserService resumeParserService;

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private com.resume.portfolio.repository.UserRepository userRepository;

    @Autowired
    private com.resume.portfolio.service.PortfolioService portfolioService;

    @PostMapping("/upload")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> uploadResume(@RequestParam("file") MultipartFile file) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            String userId = userRepository.findByUsername(username).get().getId();

            String fileName = fileStorageService.storeFile(file, userId);

            Resume.ParsedResumeData parsedData = resumeParserService.parseResume(file.getInputStream());

            Resume resume = new Resume();
            resume.setUserId(userId);
            resume.setOriginalFileName(file.getOriginalFilename());
            resume.setFileUrl("/uploads/" + fileName); // Assuming static serve
            resume.setFileType(file.getContentType());
            resume.setParsedData(parsedData);
            resume.setCreatedAt(LocalDateTime.now());
            resume.setUpdatedAt(LocalDateTime.now());
            resume.setUsedInPortfolio(false);

            Resume savedResume = resumeRepository.save(resume);

            // Auto-generate portfolio from resume
            try {
                portfolioService.generatePortfolioFromResume(userId, savedResume.getId());
            } catch (Exception e) {
                // Log error but don't fail the upload
                System.err.println("Failed to auto-generate portfolio: " + e.getMessage());
            }

            return ResponseEntity.ok(savedResume);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Could not upload the file: " + e.getMessage());
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Resume>> getUserResumes() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        String userId = userRepository.findByUsername(username).get().getId();

        return ResponseEntity.ok(resumeRepository.findByUserId(userId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> updateResumeData(@PathVariable String id,
            @RequestBody Resume.ParsedResumeData parsedData) {
        // Add ownership check
        Resume resume = resumeRepository.findById(id).orElseThrow(() -> new RuntimeException("Resume not found"));
        resume.setParsedData(parsedData);
        resume.setUpdatedAt(LocalDateTime.now());
        return ResponseEntity.ok(resumeRepository.save(resume));
    }
}
