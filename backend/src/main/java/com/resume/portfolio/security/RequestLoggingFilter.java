package com.resume.portfolio.security;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RequestLoggingFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        try (java.io.FileWriter fw = new java.io.FileWriter("debug.log", true)) {
            fw.write("Incoming request: " + req.getMethod() + " " + req.getRequestURI() + "\n");
        } catch (IOException e) {
            e.printStackTrace();
        }
        chain.doFilter(request, response);
    }
}
