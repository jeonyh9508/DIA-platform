package com.project.dia;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@MapperScan("com.project.dia.dao")
@SpringBootApplication
@EnableScheduling
public class DiaApplication {

	public static void main(String[] args) {
		SpringApplication.run(DiaApplication.class, args);
	}


}
