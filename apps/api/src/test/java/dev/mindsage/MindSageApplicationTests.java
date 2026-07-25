package dev.mindsage;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:sqlite::memory:",
        "spring.jpa.hibernate.ddl-auto=none"
})
class MindSageApplicationTests {

    @Test
    void contextLoads() {
    }
}

