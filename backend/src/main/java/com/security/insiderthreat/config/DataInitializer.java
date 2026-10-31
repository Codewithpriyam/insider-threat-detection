package com.security.insiderthreat.config;

import com.security.insiderthreat.entity.User;
import com.security.insiderthreat.repository.UserRepository;
import com.security.insiderthreat.service.SimulationService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final SimulationService simulationService;

    public DataInitializer(UserRepository userRepository, SimulationService simulationService) {
        this.userRepository = userRepository;
        this.simulationService = simulationService;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            List<User> initialUsers = Arrays.asList(
                    new User("alice.smith", "alice.smith@corp-defense.local", "Human Resources", "ROLE_USER"),
                    new User("bob.jones", "bob.jones@corp-defense.local", "Engineering", "ROLE_USER"),
                    new User("claire.chen", "claire.chen@corp-defense.local", "Marketing", "ROLE_USER"),
                    new User("marcus.vance", "marcus.vance@corp-defense.local", "Finance", "ROLE_USER"),
                    new User("elena.rostova", "elena.rostova@corp-defense.local", "Research & Development", "ROLE_USER"),
                    new User("david.kim", "david.kim@corp-defense.local", "IT Operations", "ROLE_USER"),
                    new User("sarah.connor", "sarah.connor@corp-defense.local", "Cyber Security", "ROLE_ADMIN")
            );
            userRepository.saveAll(initialUsers);

            simulationService.seedBaselineNormalTraffic();
            simulationService.simulateUnusualAccess("marcus.vance");
        }
    }
}
