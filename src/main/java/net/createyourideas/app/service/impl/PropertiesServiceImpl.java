package net.createyourideas.app.service.impl;

import java.util.List;
import java.util.Optional;
import net.createyourideas.app.domain.Properties;
import net.createyourideas.app.repository.PropertiesRepository;
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
public class PropertiesServiceImpl implements PropertiesService {

    private final Logger log = LoggerFactory.getLogger(PropertiesServiceImpl.class);

    private final PropertiesRepository propertiesRepository;

    public PropertiesServiceImpl(PropertiesRepository propertiesRepository) {
        this.propertiesRepository = propertiesRepository;
    }

    @Override
    public Properties save(Properties properties) {
        log.debug("Request to save Properties : {}", properties);
        return propertiesRepository.save(properties);
    }

    @Override
    public Optional<Properties> partialUpdate(Properties properties) {
        log.debug("Request to partially update Properties : {}", properties);

        return propertiesRepository
            .findById(properties.getId())
            .map(existingProperties -> {
                if (properties.getKey() != null) {
                    existingProperties.setKey(properties.getKey());
                }
                if (properties.getValue() != null) {
                    existingProperties.setValue(properties.getValue());
                }

                return existingProperties;
            })
            .map(propertiesRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Properties> findAll() {
        log.debug("Request to get all Properties");
        return propertiesRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Properties> findOne(Long id) {
        log.debug("Request to get Properties : {}", id);
        return propertiesRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Properties : {}", id);
        propertiesRepository.deleteById(id);
    }
}
