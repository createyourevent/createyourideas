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
import net.createyourideas.app.domain.Worksheet;
import net.createyourideas.app.repository.WorksheetExtRepository;
import net.createyourideas.app.repository.WorksheetRepository;
import net.createyourideas.app.service.WorksheetExtService;
import net.createyourideas.app.service.WorksheetService;
import net.createyourideas.app.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link net.createyourideas.app.domain.Worksheet}.
 */
@RestController
@RequestMapping("/api")
public class WorksheetExtResource {

    private final Logger log = LoggerFactory.getLogger(WorksheetExtResource.class);

    private static final String ENTITY_NAME = "worksheet";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final WorksheetExtService worksheetExtService;

    private final WorksheetExtRepository worksheetExtRepository;

    public WorksheetExtResource(WorksheetExtService worksheetExtService, WorksheetExtRepository worksheetExtRepository) {
        this.worksheetExtService = worksheetExtService;
        this.worksheetExtRepository = worksheetExtRepository;
    }

    @GetMapping("/worksheets/{id}/allByIdeaId")
    public List<Worksheet> getWorksheetsByIdeaId(@PathVariable Long id) {
        log.debug("REST request to get Idea : {}", id);
        List<Worksheet> worksheets = worksheetExtService.findAllByIdeaId(id);
        return worksheets;
    }

    @GetMapping("/worksheets/{id}/date")
    public List<Worksheet> findAllWorksheetsByIdeaIdAndDate(@PathVariable Long id, @RequestParam String date) {
        log.debug("REST request to get Income with id and date.");
        ZonedDateTime f = ZonedDateTime.now();
        try {
            f = ZonedDateTime.parse(java.net.URLDecoder.decode(date, "UTF-8"));
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        List<Worksheet> worksheets = worksheetExtService.findAllWorksheetByIdeaIdAndDate(id, f);
        return worksheets;
    }
}
