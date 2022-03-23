package net.createyourideas.app;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import net.createyourideas.app.CreateyourideasApp;
import net.createyourideas.app.config.TestSecurityConfiguration;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Base composite annotation for integration tests.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@SpringBootTest(classes = { CreateyourideasApp.class, TestSecurityConfiguration.class })
public @interface IntegrationTest {
}
