package com.project.dia.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements  WebMvcConfigurer {

@Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 서버 환경에 따라 경로가 다르므로 주석 처리함
        // registry.addResourceHandler("/upload/**")
        //        .addResourceLocations("file:///C:/dia-project/upload/");
    }

}
