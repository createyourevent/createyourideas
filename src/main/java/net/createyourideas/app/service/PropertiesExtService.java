package net.createyourideas.app.service;

import java.util.List;
import java.util.Optional;
import net.createyourideas.app.domain.Properties;

/**
 * Service Interface for managing {@link Properties}.
 */
public interface PropertiesExtService {
    Properties findByKey(String key);
}
