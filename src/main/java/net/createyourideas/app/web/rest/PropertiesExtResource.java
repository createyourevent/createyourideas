package net.createyourideas.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import net.createyourideas.app.domain.Properties;
import net.createyourideas.app.repository.PropertiesExtRepository;
import net.createyourideas.app.repository.PropertiesRepository;
import net.createyourideas.app.service.PropertiesExtService;
import net.createyourideas.app.service.PropertiesService;
import net.createyourideas.app.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link net.createyourideas.app.domain.Properties}.
 */
@RestController
@RequestMapping("/api")
public class PropertiesExtResource {

    private final Logger log = LoggerFactory.getLogger(PropertiesExtResource.class);

    private static final String ENTITY_NAME = "properties";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PropertiesExtService propertiesExtService;

    private final PropertiesExtRepository propertiesExtRepository;

    public PropertiesExtResource(PropertiesExtService propertiesExtService, PropertiesExtRepository propertiesExtRepository) {
        this.propertiesExtService = propertiesExtService;
        this.propertiesExtRepository = propertiesExtRepository;
    }



    /**
     * {@code GET  /properties/:id} : get the "id" properties.
     *
     * @param id the id of the properties to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the properties, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/properties/{key}/byKey")
    public Properties getPropertiesByKey(@PathVariable String key) {
        log.debug("REST request to get Properties : {}", key);
        Properties properties = propertiesExtService.findByKey(key);
        return properties;
    }
}
