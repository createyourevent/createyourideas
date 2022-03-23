package net.createyourideas.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import net.createyourideas.app.domain.MonthlyOutgoingsInvoice;
import net.createyourideas.app.repository.MonthlyOutgoingsInvoiceRepository;
import net.createyourideas.app.service.MonthlyOutgoingsInvoiceService;
import net.createyourideas.app.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link net.createyourideas.app.domain.MonthlyOutgoingsInvoice}.
 */
@RestController
@RequestMapping("/api")
public class MonthlyOutgoingsInvoiceResource {

    private final Logger log = LoggerFactory.getLogger(MonthlyOutgoingsInvoiceResource.class);

    private static final String ENTITY_NAME = "monthlyOutgoingsInvoice";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MonthlyOutgoingsInvoiceService monthlyOutgoingsInvoiceService;

    private final MonthlyOutgoingsInvoiceRepository monthlyOutgoingsInvoiceRepository;

    public MonthlyOutgoingsInvoiceResource(
        MonthlyOutgoingsInvoiceService monthlyOutgoingsInvoiceService,
        MonthlyOutgoingsInvoiceRepository monthlyOutgoingsInvoiceRepository
    ) {
        this.monthlyOutgoingsInvoiceService = monthlyOutgoingsInvoiceService;
        this.monthlyOutgoingsInvoiceRepository = monthlyOutgoingsInvoiceRepository;
    }

    /**
     * {@code POST  /monthly-outgoings-invoices} : Create a new monthlyOutgoingsInvoice.
     *
     * @param monthlyOutgoingsInvoice the monthlyOutgoingsInvoice to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new monthlyOutgoingsInvoice, or with status {@code 400 (Bad Request)} if the monthlyOutgoingsInvoice has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/monthly-outgoings-invoices")
    public ResponseEntity<MonthlyOutgoingsInvoice> createMonthlyOutgoingsInvoice(
        @RequestBody MonthlyOutgoingsInvoice monthlyOutgoingsInvoice
    ) throws URISyntaxException {
        log.debug("REST request to save MonthlyOutgoingsInvoice : {}", monthlyOutgoingsInvoice);
        if (monthlyOutgoingsInvoice.getId() != null) {
            throw new BadRequestAlertException("A new monthlyOutgoingsInvoice cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MonthlyOutgoingsInvoice result = monthlyOutgoingsInvoiceService.save(monthlyOutgoingsInvoice);
        return ResponseEntity
            .created(new URI("/api/monthly-outgoings-invoices/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /monthly-outgoings-invoices/:id} : Updates an existing monthlyOutgoingsInvoice.
     *
     * @param id the id of the monthlyOutgoingsInvoice to save.
     * @param monthlyOutgoingsInvoice the monthlyOutgoingsInvoice to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated monthlyOutgoingsInvoice,
     * or with status {@code 400 (Bad Request)} if the monthlyOutgoingsInvoice is not valid,
     * or with status {@code 500 (Internal Server Error)} if the monthlyOutgoingsInvoice couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/monthly-outgoings-invoices/{id}")
    public ResponseEntity<MonthlyOutgoingsInvoice> updateMonthlyOutgoingsInvoice(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody MonthlyOutgoingsInvoice monthlyOutgoingsInvoice
    ) throws URISyntaxException {
        log.debug("REST request to update MonthlyOutgoingsInvoice : {}, {}", id, monthlyOutgoingsInvoice);
        if (monthlyOutgoingsInvoice.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, monthlyOutgoingsInvoice.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!monthlyOutgoingsInvoiceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        MonthlyOutgoingsInvoice result = monthlyOutgoingsInvoiceService.save(monthlyOutgoingsInvoice);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, monthlyOutgoingsInvoice.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /monthly-outgoings-invoices/:id} : Partial updates given fields of an existing monthlyOutgoingsInvoice, field will ignore if it is null
     *
     * @param id the id of the monthlyOutgoingsInvoice to save.
     * @param monthlyOutgoingsInvoice the monthlyOutgoingsInvoice to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated monthlyOutgoingsInvoice,
     * or with status {@code 400 (Bad Request)} if the monthlyOutgoingsInvoice is not valid,
     * or with status {@code 404 (Not Found)} if the monthlyOutgoingsInvoice is not found,
     * or with status {@code 500 (Internal Server Error)} if the monthlyOutgoingsInvoice couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/monthly-outgoings-invoices/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<MonthlyOutgoingsInvoice> partialUpdateMonthlyOutgoingsInvoice(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody MonthlyOutgoingsInvoice monthlyOutgoingsInvoice
    ) throws URISyntaxException {
        log.debug("REST request to partial update MonthlyOutgoingsInvoice partially : {}, {}", id, monthlyOutgoingsInvoice);
        if (monthlyOutgoingsInvoice.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, monthlyOutgoingsInvoice.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!monthlyOutgoingsInvoiceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<MonthlyOutgoingsInvoice> result = monthlyOutgoingsInvoiceService.partialUpdate(monthlyOutgoingsInvoice);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, monthlyOutgoingsInvoice.getId().toString())
        );
    }

    /**
     * {@code GET  /monthly-outgoings-invoices} : get all the monthlyOutgoingsInvoices.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of monthlyOutgoingsInvoices in body.
     */
    @GetMapping("/monthly-outgoings-invoices")
    public List<MonthlyOutgoingsInvoice> getAllMonthlyOutgoingsInvoices() {
        log.debug("REST request to get all MonthlyOutgoingsInvoices");
        return monthlyOutgoingsInvoiceService.findAll();
    }

    /**
     * {@code GET  /monthly-outgoings-invoices/:id} : get the "id" monthlyOutgoingsInvoice.
     *
     * @param id the id of the monthlyOutgoingsInvoice to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the monthlyOutgoingsInvoice, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/monthly-outgoings-invoices/{id}")
    public ResponseEntity<MonthlyOutgoingsInvoice> getMonthlyOutgoingsInvoice(@PathVariable Long id) {
        log.debug("REST request to get MonthlyOutgoingsInvoice : {}", id);
        Optional<MonthlyOutgoingsInvoice> monthlyOutgoingsInvoice = monthlyOutgoingsInvoiceService.findOne(id);
        return ResponseUtil.wrapOrNotFound(monthlyOutgoingsInvoice);
    }

    /**
     * {@code DELETE  /monthly-outgoings-invoices/:id} : delete the "id" monthlyOutgoingsInvoice.
     *
     * @param id the id of the monthlyOutgoingsInvoice to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/monthly-outgoings-invoices/{id}")
    public ResponseEntity<Void> deleteMonthlyOutgoingsInvoice(@PathVariable Long id) {
        log.debug("REST request to delete MonthlyOutgoingsInvoice : {}", id);
        monthlyOutgoingsInvoiceService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
