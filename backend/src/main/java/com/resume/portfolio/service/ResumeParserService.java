package com.resume.portfolio.service;

import com.resume.portfolio.model.Resume;
import org.apache.tika.Tika;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ResumeParserService {

    public Resume.ParsedResumeData parseResume(InputStream inputStream) throws Exception {
        Tika tika = new Tika();
        String content = tika.parseToString(inputStream);

        // Normalize content
        content = content.replace("\r\n", "\n").replace("\r", "\n");

        Resume.ParsedResumeData data = new Resume.ParsedResumeData();

        // Extract basic information
        data.setEmail(extractEmail(content));
        data.setPhone(extractPhone(content));
        data.setSummary(extractSummary(content));

        // Extract skills
        data.setSkills(extractSkills(content));

        // Extract experience
        data.setExperience(extractExperience(content));

        // Extract education
        data.setEducation(extractEducation(content));

        // Extract projects
        data.setProjects(extractProjects(content));

        // Extract additional sections
        data.setCertifications(extractSimpleList(content,
                new String[] { "certifications", "certificates", "credentials", "licenses" }));
        data.setLanguages(extractSimpleList(content, new String[] { "languages", "spoken languages" }));
        data.setAwards(
                extractSimpleList(content, new String[] { "awards", "honors", "achievements", "accomplishments" }));

        return data;
    }

    private List<String> extractSimpleList(String content, String[] keywords) {
        List<String> items = new ArrayList<>();
        String[] lines = content.split("\n");
        boolean inSection = false;

        for (String line : lines) {
            String trimmedLine = line.trim();
            if (trimmedLine.isEmpty())
                continue;

            String lowerLine = trimmedLine.toLowerCase();
            boolean isHeader = isSectionHeader(lowerLine);

            // Check start of section
            if (isHeader) {
                boolean matchFound = false;
                for (String keyword : keywords) {
                    if (lowerLine.contains(keyword)) {
                        matchFound = true;
                        break;
                    }
                }
                if (matchFound) {
                    inSection = true;
                    // Check for inline content (e.g., "Languages: English, Spanish")
                    if (trimmedLine.contains(":")) {
                        String[] parts = trimmedLine.split(":", 2);
                        if (parts.length > 1 && !parts[1].trim().isEmpty()) {
                            // It has inline content, treat as an item (or split by commas)
                            String explicitContent = parts[1].trim();
                            // If languages, maybe comma separated?
                            if (explicitContent.contains(",")) {
                                Arrays.stream(explicitContent.split(",")).forEach(s -> {
                                    String c = cleanText(s);
                                    if (!c.isEmpty())
                                        items.add(c);
                                });
                            } else {
                                items.add(cleanText(explicitContent));
                            }
                        }
                    }
                    continue;
                }
            }

            // Check end of section
            if (inSection && isHeader) {
                boolean matchFound = false;
                for (String keyword : keywords) {
                    if (lowerLine.contains(keyword)) {
                        matchFound = true; // It's the same section header repeated
                        break;
                    }
                }
                if (!matchFound) {
                    break;
                }
            }

            if (inSection) {
                // Remove bullet points
                String cleaned = trimmedLine.replaceAll("^[•\\-–—*·\\s]+", "").trim();
                if (!cleaned.isEmpty() && cleaned.length() > 2) {
                    // If it looks like a separated list (comma separated on one line), split it
                    // Good for Languages or multiple short Certs
                    if (cleaned.contains(",") && cleaned.length() < 100 && keywords[0].contains("language")) { // simple
                                                                                                               // heuristic
                                                                                                               // for
                                                                                                               // languages
                        Arrays.stream(cleaned.split(",")).forEach(s -> {
                            String c = cleanText(s);
                            if (!c.isEmpty())
                                items.add(c);
                        });
                    } else {
                        items.add(cleaned);
                    }
                }
            }
        }
        System.out.println("Parsed " + keywords[0] + ": " + items); // Debug log
        return items;
    }

    private String extractEmail(String content) {
        Pattern pattern = Pattern.compile("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}");
        Matcher matcher = pattern.matcher(content);
        return matcher.find() ? matcher.group() : "";
    }

    private String extractPhone(String content) {
        // More robust phone regex
        Pattern pattern = Pattern.compile("(\\+\\d{1,3}[-.\\s]?)?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}");
        Matcher matcher = pattern.matcher(content);
        return matcher.find() ? matcher.group() : "";
    }

    private String extractSummary(String content) {
        String[] lines = content.split("\n");
        StringBuilder summary = new StringBuilder();
        boolean inSummary = false;

        for (String line : lines) {
            String trimmedLine = line.trim();
            if (trimmedLine.isEmpty())
                continue;

            String lowerLine = trimmedLine.toLowerCase();

            // Detect start of summary
            if (isSectionHeader(lowerLine) && (lowerLine.contains("summary") || lowerLine.contains("objective")
                    || lowerLine.contains("profile") || lowerLine.contains("about"))) {
                inSummary = true;
                continue;
            }

            // Detect end of summary (start of another section)
            if (inSummary && isSectionHeader(lowerLine) && !lowerLine.contains("summary")
                    && !lowerLine.contains("objective") && !lowerLine.contains("profile")
                    && !lowerLine.contains("about")) {
                break;
            }

            if (inSummary) {
                summary.append(trimmedLine).append(" ");
            }
        }

        // Fallback: if no summary section found, take the first paragraph that isn't a
        // header/contact info
        if (summary.length() == 0) {
            int lineCount = 0;
            for (String line : lines) {
                String trimmed = line.trim();
                if (!trimmed.isEmpty() && !isSectionHeader(trimmed.toLowerCase()) && !trimmed.contains("@")) {
                    summary.append(trimmed).append(" ");
                    lineCount++;
                    if (lineCount >= 4)
                        break; // Limit fallback to 4 lines
                }
            }
        }

        return summary.toString().trim();
    }

    private List<String> extractSkills(String content) {
        List<String> skills = new ArrayList<>();
        String[] lines = content.split("\n");
        boolean inSkills = false;

        for (String line : lines) {
            String trimmedLine = line.trim();
            if (trimmedLine.isEmpty())
                continue;

            String lowerLine = trimmedLine.toLowerCase();

            if (isSectionHeader(lowerLine) && (lowerLine.contains("skills") || lowerLine.contains("technologies")
                    || lowerLine.contains("competencies") || lowerLine.contains("stack"))) {
                inSkills = true;
                continue;
            }

            if (inSkills && isSectionHeader(lowerLine) && !lowerLine.contains("skills")
                    && !lowerLine.contains("technologies")) {
                break;
            }

            if (inSkills) {
                // Split by common delimiters: comma, pipe, bullet points
                String[] tokens = trimmedLine.split("[,|•·;]");
                for (String token : tokens) {
                    String skill = token.trim();
                    // Filter out noise
                    if (!skill.isEmpty() && skill.length() > 1 && skill.length() < 30) {
                        skills.add(skill);
                    }
                }
            }
        }

        return skills;
    }

    private List<Resume.Experience> extractExperience(String content) {
        List<Resume.Experience> experiences = new ArrayList<>();
        String[] lines = content.split("\n");
        boolean inExperience = false;
        Resume.Experience currentExp = null;
        String prevLine = "";

        for (String line : lines) {
            String trimmedLine = line.trim();
            if (trimmedLine.isEmpty())
                continue;

            String lowerLine = trimmedLine.toLowerCase();

            // Start of Experience Section
            if (isSectionHeader(lowerLine) && (lowerLine.contains("experience") || lowerLine.contains("employment")
                    || lowerLine.contains("work history"))) {
                inExperience = true;
                prevLine = trimmedLine;
                continue;
            }

            // End of Experience Section (Start of another section)
            if (inExperience && isSectionHeader(lowerLine) && !lowerLine.contains("experience")
                    && !lowerLine.contains("employment")) {
                if (currentExp != null) {
                    experiences.add(currentExp);
                    currentExp = null; // Reset to avoid double adding
                }
                break;
            }

            if (inExperience) {
                // Check if line indicates a new job entry (has date range)
                if (containsDateRange(trimmedLine)) {
                    if (currentExp != null) {
                        experiences.add(currentExp);
                    }
                    currentExp = new Resume.Experience();

                    extractDates(trimmedLine, currentExp);

                    // Remove dates to analyze remaining text
                    String textWithoutDates = trimmedLine.replaceAll(
                            "(?i)(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\\s*\\d{4}|\\d{4}|Present|Current|–|-",
                            "").trim();
                    textWithoutDates = textWithoutDates.replaceAll("\\s+", " ").trim();

                    // Heuristic 1: "Title at Company" or "Title @ Company"
                    if (textWithoutDates.toLowerCase().contains(" at ") || textWithoutDates.contains("@")) {
                        String[] parts = textWithoutDates.split("(?i)\\s+at\\s+|\\s*@\\s*");
                        if (parts.length > 1) {
                            currentExp.setTitle(cleanText(parts[0]));
                            currentExp.setCompany(cleanText(parts[1]));
                        } else {
                            currentExp.setTitle(cleanText(textWithoutDates));
                        }
                    }
                    // Heuristic 2: Separated by pipe or dash (if dash wasn't just a date separator)
                    else if (textWithoutDates.contains("|")
                            || (textWithoutDates.contains("-") && textWithoutDates.length() > 5)) {
                        String[] parts = textWithoutDates.split("\\||-");
                        if (parts.length > 1) {
                            String p1 = cleanText(parts[0]);
                            String p2 = cleanText(parts[1]);
                            // Guess which is company based on common entity suffixes or length
                            if (p2.matches(".*(?i)(Inc|LLC|Corp|Ltd|Solutions|Systems|Technologies).*")
                                    || p1.length() > p2.length()) {
                                currentExp.setTitle(p1);
                                currentExp.setCompany(p2);
                            } else {
                                currentExp.setCompany(p1);
                                currentExp.setTitle(p2);
                            }
                        } else {
                            currentExp.setTitle(cleanText(textWithoutDates));
                        }
                    }
                    // Heuristic 3: Check previous line for Company Name if current line is just
                    // Title/Date
                    else {
                        currentExp.setTitle(cleanText(textWithoutDates));
                        if (!prevLine.isEmpty() && !containsDateRange(prevLine) && !isSectionHeader(prevLine)
                                && prevLine.length() < 50) {
                            currentExp.setCompany(cleanText(prevLine));
                        }
                    }

                    if (currentExp.getTitle().isEmpty()) {
                        currentExp.setTitle("Position");
                    }
                } else if (currentExp != null) {
                    // If Company is still empty, the very next line might be the company
                    if ((currentExp.getCompany() == null || currentExp.getCompany().isEmpty())
                            && !isBulletPoint(trimmedLine)) {
                        currentExp.setCompany(trimmedLine);
                    } else {
                        // Otherwise it's a description
                        String desc = currentExp.getDescription() != null ? currentExp.getDescription() : "";
                        currentExp.setDescription(desc + " " + trimmedLine);
                    }
                }
            }
            prevLine = trimmedLine;
        }

        // Add the last one if loop finished naturally
        if (currentExp != null) {
            experiences.add(currentExp);
        }

        return experiences;
    }

    private String cleanText(String text) {
        return text.replaceAll("^[\\W_]+|[\\W_]+$", "").trim();
    }

    private boolean isBulletPoint(String line) {
        return line.trim().startsWith("•") || line.trim().startsWith("-") || line.trim().startsWith("*")
                || line.trim().startsWith("·");
    }

    private List<Resume.Education> extractEducation(String content) {
        List<Resume.Education> educationList = new ArrayList<>();
        String[] lines = content.split("\n");
        boolean inEducation = false;
        Resume.Education currentEdu = null;

        for (String line : lines) {
            String trimmedLine = line.trim();
            if (trimmedLine.isEmpty())
                continue;

            String lowerLine = trimmedLine.toLowerCase();

            if (isSectionHeader(lowerLine) && (lowerLine.contains("education") || lowerLine.contains("academic")
                    || lowerLine.contains("qualification"))) {
                inEducation = true;
                continue;
            }

            if (inEducation && isSectionHeader(lowerLine) && !lowerLine.contains("education")
                    && !lowerLine.contains("academic")) {
                if (currentEdu != null) {
                    educationList.add(currentEdu);
                    currentEdu = null;
                }
                break;
            }

            if (inEducation) {
                if (containsDateRange(trimmedLine) || trimmedLine.matches(".*\\d{4}.*")) {
                    if (currentEdu != null) {
                        educationList.add(currentEdu);
                    }
                    currentEdu = new Resume.Education();

                    extractDates(trimmedLine, currentEdu);

                    // Heuristic for degree/school
                    String text = trimmedLine.replaceAll("\\d{4}|[-–—]|Present", "").trim();
                    if (text.length() > 0) {
                        currentEdu.setDegree(text);
                    }
                } else if (currentEdu != null) {
                    if (currentEdu.getSchool() == null) {
                        currentEdu.setSchool(trimmedLine);
                    } else {
                        // Append to degree if it looks like a degree
                        if (trimmedLine.toLowerCase().contains("bachelor")
                                || trimmedLine.toLowerCase().contains("master")
                                || trimmedLine.toLowerCase().contains("degree")) {
                            currentEdu.setDegree(currentEdu.getDegree() + " " + trimmedLine);
                        } else {
                            currentEdu.setSchool(currentEdu.getSchool() + ", " + trimmedLine);
                        }
                    }
                }
            }
        }

        if (currentEdu != null) {
            educationList.add(currentEdu);
        }

        return educationList;
    }

    private List<Resume.Project> extractProjects(String content) {
        List<Resume.Project> projects = new ArrayList<>();
        String[] lines = content.split("\n");
        boolean inProjects = false;
        List<String> projectSectionBuffer = new ArrayList<>();

        // 1. Isolate Project Section
        for (String line : lines) {
            String trimmedLine = line.trim();
            if (trimmedLine.isEmpty())
                continue;
            String lowerLine = trimmedLine.toLowerCase();

            if (isSectionHeader(lowerLine) && (lowerLine.contains("projects") || lowerLine.contains("portfolio"))) {
                inProjects = true;
                continue;
            }

            if (inProjects && isSectionHeader(lowerLine) && !lowerLine.contains("projects")) {
                break;
            }

            if (inProjects) {
                projectSectionBuffer.add(trimmedLine);
            }
        }

        // 2. Identify Titles and Group Descriptions
        Resume.Project currentProject = null;

        for (int i = 0; i < projectSectionBuffer.size(); i++) {
            String line = projectSectionBuffer.get(i);
            String nextLine = (i + 1 < projectSectionBuffer.size()) ? projectSectionBuffer.get(i + 1) : "";

            boolean isBullet = isBulletPoint(line);
            boolean isNextBullet = isBulletPoint(nextLine);
            boolean hasDate = containsDateRange(line) || line.matches(".*\\d{4}.*");

            // Heuristic for Title:
            // 1. Never a bullet point.
            // 2. Never ends with a period (descriptions often do).
            // 3. Strong Signals:
            // a. Has a Date on the line.
            // b. Followed immediately by a bullet point (Structural Signal).
            // c. Followed immediately by "Tech Stack" / "Technologies" etc.
            // d. Is explicitly short, Capitalized, and NOT a common link/contact line.

            boolean looksLikeTitle = !isBullet && !line.endsWith(".") && (hasDate ||
                    isNextBullet ||
                    (nextLine.toLowerCase().contains("tech") && nextLine.contains(":")) ||
                    line.matches(".*[|].*") || // Pipe separator often Title | Tools
                    (line.length() < 60 && Character.isUpperCase(line.charAt(0)) && !line.contains("http")
                            && !line.contains("@")));

            // Special case for "Title: Description" on one line
            boolean hasColonTitle = line.contains(":") && line.indexOf(":") < 40
                    && !line.toLowerCase().startsWith("http") && !isBullet;

            if (looksLikeTitle || hasColonTitle) {
                // If we found a NEW title, save the OLD project
                if (currentProject != null) {
                    projects.add(currentProject);
                }

                // Initialize NEW project
                currentProject = new Resume.Project();
                String name = line;
                String descPart = "";

                if (hasColonTitle && !hasDate) {
                    String[] parts = line.split(":", 2);
                    name = parts[0].trim();
                    if (parts.length > 1)
                        descPart = parts[1].trim();
                } else if (hasDate) {
                    String dateRegex = "(?i)((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\\.?)?\\s*\\d{4}.*";
                    String nameNoDate = line.replaceAll(dateRegex, "").trim();
                    if (nameNoDate.length() > 2)
                        name = nameNoDate;
                }

                // Clean name
                name = cleanText(name);
                if (name.endsWith("|") || name.endsWith("-"))
                    name = name.substring(0, name.length() - 1).trim();
                if (name.length() < 2)
                    name = "Project " + (projects.size() + 1); // Fallback

                currentProject.setName(name);
                if (!descPart.isEmpty()) {
                    currentProject.setDescription(descPart);
                }

            } else if (currentProject != null) {
                // It's NOT a title, so it MUST be description for the current project
                String desc = currentProject.getDescription() != null ? currentProject.getDescription() : "";

                // If appending, add space or newline? Space is safer for flow.
                // But check if it's a new bullet
                String separator = (isBullet || desc.isEmpty()) ? " " : " ";
                currentProject.setDescription(desc + separator + line);

                // Also check for URL
                if (line.contains("http")) {
                    Pattern urlPattern = Pattern.compile("(https?://[^\\s]+)");
                    Matcher urlMatcher = urlPattern.matcher(line);
                    if (urlMatcher.find()) {
                        currentProject.setUrl(urlMatcher.group(1));
                    }
                }
            } else {
                // Orphan line at start? Treat as First Project's Title if reasonable
                if (!isBullet && line.length() < 80) {
                    currentProject = new Resume.Project();
                    currentProject.setName(cleanText(line));
                }
            }
        }

        if (currentProject != null) {
            projects.add(currentProject);
        }

        System.out.println("Title-to-Title Extraction: found " + projects.size() + " projects.");
        return projects;
    }

    private boolean isPotentialTitle(String line) {
        // Less strict title check
        // 1. Must have some length
        // 2. Not a bullet
        // 3. Not a common link/contact line
        // 4. Ideally Capitalized or completely UPPERCASE
        if (line.length() < 2 || line.length() > 80)
            return false;

        String lower = line.toLowerCase();
        if (lower.startsWith("http") || lower.contains("@") || lower.contains("www."))
            return false;

        // If it's short and no lowercase letters (UPPERCASE TITLE)
        if (line.toUpperCase().equals(line) && line.matches(".*[A-Z].*"))
            return true;

        // If it ends with colon
        if (line.trim().endsWith(":"))
            return true;

        // If it starts with Capital letter and isn't too long
        if (Character.isUpperCase(line.charAt(0)) && line.length() < 50)
            return true;

        return false;
    }

    // Helper methods

    private boolean isSectionHeader(String line) {
        String l = line.toLowerCase();
        // Section headers are usually short and contain specific keywords
        if (l.length() > 60) // Relaxed from 30
            return false;
        return l.equals("experience") || l.equals("work experience") || l.equals("education") ||
                l.equals("skills") || l.equals("technical skills") || l.equals("projects") ||
                l.equals("summary") || l.equals("objective") || l.equals("profile") ||
                l.equals("certifications") || l.equals("activities") || l.equals("achievements") ||
                l.equals("workshops") || l.equals("languages") || l.equals("interests") ||
                l.equals("awards") || l.equals("publications") || l.equals("references") ||
                l.equals("volunteering") ||
                l.contains("experience") || l.contains("education") || l.contains("skill") || l.contains("project") ||
                l.contains("certificat") || l.contains("activit") || l.contains("achieve") ||
                l.contains("workshop") || l.contains("language") || l.contains("interest") ||
                l.contains("award") || l.contains("publicat") || l.contains("reference") ||
                l.contains("volunteer") || l.contains("curricular") ||
                l.contains("contact") || l.contains("link") || l.contains("social") || l.contains("connect") ||
                l.equals("additional info") || l.equals("miscellaneous");
    }

    private boolean isTitleCandidate(String line, boolean isBulletPoint, boolean isDateLine, boolean hasDate) {
        if (isBulletPoint || isDateLine)
            return false;

        // Strict exclusions for URLs, Emails, and common contact patterns
        String lower = line.toLowerCase();
        if (lower.startsWith("http") || lower.startsWith("www") || lower.startsWith("mailto") ||
                lower.contains("@") || lower.contains("github.com") || lower.contains("linkedin.com") ||
                lower.contains("gitlab.com") || lower.contains("leetcode.com")) {
            return false;
        }

        return hasDate ||
                (line.length() < 60 && Character.isUpperCase(line.charAt(0)) && !line.endsWith(".")) ||
                line.endsWith(":") ||
                (line.equals(line.toUpperCase()) && line.length() > 3 && !line.matches(".*[0-9].*"));
    }

    private boolean containsDateRange(String line) {
        return line.matches(".*\\d{4}.*");
    }

    private void extractDates(String line, Object target) {
        Pattern datePattern = Pattern.compile("(\\d{4})");
        Matcher matcher = datePattern.matcher(line);
        String start = null;
        String end = null;

        while (matcher.find()) {
            if (start == null)
                start = matcher.group(1);
            else
                end = matcher.group(1);
        }

        if (line.toLowerCase().contains("present") || line.toLowerCase().contains("current")) {
            end = "Present";
        }

        if (target instanceof Resume.Experience) {
            ((Resume.Experience) target).setStartDate(start);
            ((Resume.Experience) target).setEndDate(end);
        } else if (target instanceof Resume.Education) {
            ((Resume.Education) target).setStartDate(start);
            ((Resume.Education) target).setEndDate(end);
        }
    }
}
