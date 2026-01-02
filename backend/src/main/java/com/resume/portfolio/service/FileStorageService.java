package com.resume.portfolio.service;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

public interface FileStorageService {
    String storeFile(MultipartFile file, String userId) throws IOException;

    void deleteFile(String fileUrl);
}
