package net.createyourideas.app.web.rest;


import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import net.createyourideas.app.domain.Point;
import net.createyourideas.app.service.PointExtService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link org.createyourevent.domain.Point}.
 */
@RestController
@RequestMapping("/api")
public class PointExtResource {

    private final Logger log = LoggerFactory.getLogger(PointResource.class);

    private static final String ENTITY_NAME = "point";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PointExtService pointExtService;

    public PointExtResource(PointExtService pointExtService) {
        this.pointExtService = pointExtService;
    }

    /**
     * {@code GET  /points/:id} : get the "id" point.
     *
     * @param id the id of the point to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the point, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/points/key/{key}")
    public Point getPoint(@PathVariable String key) {
        log.debug("REST request to get Point with key : {}", key);
        Point op =  pointExtService.findByKey(key);
        return op;
    }
}
