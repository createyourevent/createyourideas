package net.createyourideas.app.service.impl;

import java.util.List;
import java.util.Optional;
import net.createyourideas.app.domain.Properties;
import net.createyourideas.app.repository.PropertiesExtRepository;
import net.createyourideas.app.repository.PropertiesRepository;
import net.createyourideas.app.service.PropertiesExtService;
import net.createyourideas.app.service.PropertiesService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Properties}.
 */
@Service
@Transactional
public class PropertiesExtServiceImpl implements PropertiesExtService {

    private final Logger log = LoggerFactory.getLogger(PropertiesServiceImpl.class);

    private final PropertiesExtRepository propertiesExtRepository;

    public PropertiesExtServiceImpl(PropertiesExtRepository propertiesExtRepository) {
        this.propertiesExtRepository = propertiesExtRepository;
    }

    @Override
    public Properties findByKey(String key) {
        return propertiesExtRepository.findByKey(key);
    }

}
