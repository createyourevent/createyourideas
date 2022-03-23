package net.createyourideas.app.repository;

import net.createyourideas.app.domain.Properties;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Properties entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PropertiesExtRepository extends JpaRepository<Properties, Long> {
    Properties findByKey(String key);
}
