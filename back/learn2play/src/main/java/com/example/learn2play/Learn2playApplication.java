package com.example.learn2play;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class Learn2playApplication {

	public static void main(String[] args) {
		SpringApplication.run(Learn2playApplication.class, args);
	}

}
