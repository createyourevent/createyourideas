package net.createyourideas.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import net.createyourideas.app.domain.Worksheet;
import net.createyourideas.app.repository.WorksheetRepository;
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
public class WorksheetResource {

    private final Logger log = LoggerFactory.getLogger(WorksheetResource.class);

    private static final String ENTITY_NAME = "worksheet";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final WorksheetService worksheetService;

    private final WorksheetRepository worksheetRepository;

    public WorksheetResource(WorksheetService worksheetService, WorksheetRepository worksheetRepository) {
        this.worksheetService = worksheetService;
        this.worksheetRepository = worksheetRepository;
    }

    /**
     * {@code POST  /worksheets} : Create a new worksheet.
     *
     * @param worksheet the worksheet to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new worksheet, or with status {@code 400 (Bad Request)} if the worksheet has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/worksheets")
    public ResponseEntity<Worksheet> createWorksheet(@Valid @RequestBody Worksheet worksheet) throws URISyntaxException {
        log.debug("REST request to save Worksheet : {}", worksheet);
        if (worksheet.getId() != null) {
            throw new BadRequestAlertException("A new worksheet cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Worksheet result = worksheetService.save(worksheet);
        return ResponseEntity
            .created(new URI("/api/worksheets/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /worksheets/:id} : Updates an existing worksheet.
     *
     * @param id the id of the worksheet to save.
     * @param worksheet the worksheet to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated worksheet,
     * or with status {@code 400 (Bad Request)} if the worksheet is not valid,
     * or with status {@code 500 (Internal Server Error)} if the worksheet couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/worksheets/{id}")
    public ResponseEntity<Worksheet> updateWorksheet(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Worksheet worksheet
    ) throws URISyntaxException {
        log.debug("REST request to update Worksheet : {}, {}", id, worksheet);
        if (worksheet.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, worksheet.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!worksheetRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Worksheet result = worksheetService.save(worksheet);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, worksheet.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /worksheets/:id} : Partial updates given fields of an existing worksheet, field will ignore if it is null
     *
     * @param id the id of the worksheet to save.
     * @param worksheet the worksheet to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated worksheet,
     * or with status {@code 400 (Bad Request)} if the worksheet is not valid,
     * or with status {@code 404 (Not Found)} if the worksheet is not found,
     * or with status {@code 500 (Internal Server Error)} if the worksheet couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/worksheets/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Worksheet> partialUpdateWorksheet(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Worksheet worksheet
    ) throws URISyntaxException {
        log.debug("REST request to partial update Worksheet partially : {}, {}", id, worksheet);
        if (worksheet.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, worksheet.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!worksheetRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Worksheet> result = worksheetService.partialUpdate(worksheet);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, worksheet.getId().toString())
        );
    }

    /**
     * {@code GET  /worksheets} : get all the worksheets.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of worksheets in body.
     */
    @GetMapping("/worksheets")
    public List<Worksheet> getAllWorksheets() {
        log.debug("REST request to get all Worksheets");
        return worksheetService.findAll();
    }

    /**
     * {@code GET  /worksheets/:id} : get the "id" worksheet.
     *
     * @param id the id of the worksheet to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the worksheet, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/worksheets/{id}")
    public ResponseEntity<Worksheet> getWorksheet(@PathVariable Long id) {
        log.debug("REST request to get Worksheet : {}", id);
        Optional<Worksheet> worksheet = worksheetService.findOne(id);
        return ResponseUtil.wrapOrNotFound(worksheet);
    }

    /**
     * {@code DELETE  /worksheets/:id} : delete the "id" worksheet.
     *
     * @param id the id of the worksheet to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/worksheets/{id}")
    public ResponseEntity<Void> deleteWorksheet(@PathVariable Long id) {
        log.debug("REST request to delete Worksheet : {}", id);
        worksheetService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
