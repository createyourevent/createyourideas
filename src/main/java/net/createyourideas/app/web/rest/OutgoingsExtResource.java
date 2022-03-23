package net.createyourideas.app.web.rest;

import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import net.createyourideas.app.domain.Outgoings;
import net.createyourideas.app.repository.OutgoingsExtRepository;
import net.createyourideas.app.repository.OutgoingsRepository;
import net.createyourideas.app.service.OutgoingsExtService;
import net.createyourideas.app.service.OutgoingsService;
import net.createyourideas.app.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link net.createyourideas.app.domain.Outgoings}.
 */
@RestController
@RequestMapping("/api")
public class OutgoingsExtResource {

    private final Logger log = LoggerFactory.getLogger(OutgoingsResource.class);

    private static final String ENTITY_NAME = "outgoings";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OutgoingsExtService outgoingsExtService;

    private final OutgoingsExtRepository outgoingsExtRepository;

    public OutgoingsExtResource(OutgoingsExtService outgoingsExtService, OutgoingsExtRepository outgoingsExtRepository) {
        this.outgoingsExtService = outgoingsExtService;
        this.outgoingsExtRepository = outgoingsExtRepository;
    }


    @GetMapping("/outgoings/{id}/allByIdeaId")
    public List<Outgoings> getOutgoingsByIdeaId(@PathVariable Long id) {
        log.debug("REST request to get Idea : {}", id);
        List<Outgoings> outgoings = outgoingsExtService.findAllByIdeaId(id);
        return outgoings;
    }

    @GetMapping("/outgoings/{id}/date")
    public List<Outgoings> findAllOutgoingsByIdeaIdAndDate(@PathVariable Long id, @RequestParam String date) {
        log.debug("REST request to get Income with id and date.");
        ZonedDateTime f = ZonedDateTime.now();
        try {
            f = ZonedDateTime.parse(java.net.URLDecoder.decode(date, "UTF-8"));
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        List<Outgoings> outgoings = outgoingsExtService.findAllOutgoingByIdeaIdAndDate(id, f);
        return outgoings;
    }
}
