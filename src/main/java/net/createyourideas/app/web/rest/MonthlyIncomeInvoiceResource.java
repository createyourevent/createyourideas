package net.createyourideas.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import net.createyourideas.app.domain.MonthlyIncomeInvoice;
import net.createyourideas.app.repository.MonthlyIncomeInvoiceRepository;
import net.createyourideas.app.service.MonthlyIncomeInvoiceService;
import net.createyourideas.app.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link net.createyourideas.app.domain.MonthlyIncomeInvoice}.
 */
@RestController
@RequestMapping("/api")
public class MonthlyIncomeInvoiceResource {

    private final Logger log = LoggerFactory.getLogger(MonthlyIncomeInvoiceResource.class);

    private static final String ENTITY_NAME = "monthlyIncomeInvoice";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MonthlyIncomeInvoiceService monthlyIncomeInvoiceService;

    private final MonthlyIncomeInvoiceRepository monthlyIncomeInvoiceRepository;

    public MonthlyIncomeInvoiceResource(
        MonthlyIncomeInvoiceService monthlyIncomeInvoiceService,
        MonthlyIncomeInvoiceRepository monthlyIncomeInvoiceRepository
    ) {
        this.monthlyIncomeInvoiceService = monthlyIncomeInvoiceService;
        this.monthlyIncomeInvoiceRepository = monthlyIncomeInvoiceRepository;
    }

    /**
     * {@code POST  /monthly-income-invoices} : Create a new monthlyIncomeInvoice.
     *
     * @param monthlyIncomeInvoice the monthlyIncomeInvoice to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new monthlyIncomeInvoice, or with status {@code 400 (Bad Request)} if the monthlyIncomeInvoice has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/monthly-income-invoices")
    public ResponseEntity<MonthlyIncomeInvoice> createMonthlyIncomeInvoice(@RequestBody MonthlyIncomeInvoice monthlyIncomeInvoice)
        throws URISyntaxException {
        log.debug("REST request to save MonthlyIncomeInvoice : {}", monthlyIncomeInvoice);
        if (monthlyIncomeInvoice.getId() != null) {
            throw new BadRequestAlertException("A new monthlyIncomeInvoice cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MonthlyIncomeInvoice result = monthlyIncomeInvoiceService.save(monthlyIncomeInvoice);
        return ResponseEntity
            .created(new URI("/api/monthly-income-invoices/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /monthly-income-invoices/:id} : Updates an existing monthlyIncomeInvoice.
     *
     * @param id the id of the monthlyIncomeInvoice to save.
     * @param monthlyIncomeInvoice the monthlyIncomeInvoice to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated monthlyIncomeInvoice,
     * or with status {@code 400 (Bad Request)} if the monthlyIncomeInvoice is not valid,
     * or with status {@code 500 (Internal Server Error)} if the monthlyIncomeInvoice couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/monthly-income-invoices/{id}")
    public ResponseEntity<MonthlyIncomeInvoice> updateMonthlyIncomeInvoice(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody MonthlyIncomeInvoice monthlyIncomeInvoice
    ) throws URISyntaxException {
        log.debug("REST request to update MonthlyIncomeInvoice : {}, {}", id, monthlyIncomeInvoice);
        if (monthlyIncomeInvoice.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, monthlyIncomeInvoice.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!monthlyIncomeInvoiceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        MonthlyIncomeInvoice result = monthlyIncomeInvoiceService.save(monthlyIncomeInvoice);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, monthlyIncomeInvoice.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /monthly-income-invoices/:id} : Partial updates given fields of an existing monthlyIncomeInvoice, field will ignore if it is null
     *
     * @param id the id of the monthlyIncomeInvoice to save.
     * @param monthlyIncomeInvoice the monthlyIncomeInvoice to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated monthlyIncomeInvoice,
     * or with status {@code 400 (Bad Request)} if the monthlyIncomeInvoice is not valid,
     * or with status {@code 404 (Not Found)} if the monthlyIncomeInvoice is not found,
     * or with status {@code 500 (Internal Server Error)} if the monthlyIncomeInvoice couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/monthly-income-invoices/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<MonthlyIncomeInvoice> partialUpdateMonthlyIncomeInvoice(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody MonthlyIncomeInvoice monthlyIncomeInvoice
    ) throws URISyntaxException {
        log.debug("REST request to partial update MonthlyIncomeInvoice partially : {}, {}", id, monthlyIncomeInvoice);
        if (monthlyIncomeInvoice.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, monthlyIncomeInvoice.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!monthlyIncomeInvoiceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<MonthlyIncomeInvoice> result = monthlyIncomeInvoiceService.partialUpdate(monthlyIncomeInvoice);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, monthlyIncomeInvoice.getId().toString())
        );
    }

    /**
     * {@code GET  /monthly-income-invoices} : get all the monthlyIncomeInvoices.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of monthlyIncomeInvoices in body.
     */
    @GetMapping("/monthly-income-invoices")
    public List<MonthlyIncomeInvoice> getAllMonthlyIncomeInvoices() {
        log.debug("REST request to get all MonthlyIncomeInvoices");
        return monthlyIncomeInvoiceService.findAll();
    }

    /**
     * {@code GET  /monthly-income-invoices/:id} : get the "id" monthlyIncomeInvoice.
     *
     * @param id the id of the monthlyIncomeInvoice to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the monthlyIncomeInvoice, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/monthly-income-invoices/{id}")
    public ResponseEntity<MonthlyIncomeInvoice> getMonthlyIncomeInvoice(@PathVariable Long id) {
        log.debug("REST request to get MonthlyIncomeInvoice : {}", id);
        Optional<MonthlyIncomeInvoice> monthlyIncomeInvoice = monthlyIncomeInvoiceService.findOne(id);
        return ResponseUtil.wrapOrNotFound(monthlyIncomeInvoice);
    }

    /**
     * {@code DELETE  /monthly-income-invoices/:id} : delete the "id" monthlyIncomeInvoice.
     *
     * @param id the id of the monthlyIncomeInvoice to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/monthly-income-invoices/{id}")
    public ResponseEntity<Void> deleteMonthlyIncomeInvoice(@PathVariable Long id) {
        log.debug("REST request to delete MonthlyIncomeInvoice : {}", id);
        monthlyIncomeInvoiceService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
