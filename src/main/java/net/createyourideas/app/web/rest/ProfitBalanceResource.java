package net.createyourideas.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.StreamSupport;
import net.createyourideas.app.domain.ProfitBalance;
import net.createyourideas.app.repository.ProfitBalanceRepository;
import net.createyourideas.app.service.ProfitBalanceService;
import net.createyourideas.app.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link net.createyourideas.app.domain.ProfitBalance}.
 */
@RestController
@RequestMapping("/api")
public class ProfitBalanceResource {

    private final Logger log = LoggerFactory.getLogger(ProfitBalanceResource.class);

    private static final String ENTITY_NAME = "profitBalance";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProfitBalanceService profitBalanceService;

    private final ProfitBalanceRepository profitBalanceRepository;

    public ProfitBalanceResource(ProfitBalanceService profitBalanceService, ProfitBalanceRepository profitBalanceRepository) {
        this.profitBalanceService = profitBalanceService;
        this.profitBalanceRepository = profitBalanceRepository;
    }

    /**
     * {@code POST  /profit-balances} : Create a new profitBalance.
     *
     * @param profitBalance the profitBalance to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new profitBalance, or with status {@code 400 (Bad Request)} if the profitBalance has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/profit-balances")
    public ResponseEntity<ProfitBalance> createProfitBalance(@RequestBody ProfitBalance profitBalance) throws URISyntaxException {
        log.debug("REST request to save ProfitBalance : {}", profitBalance);
        if (profitBalance.getId() != null) {
            throw new BadRequestAlertException("A new profitBalance cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ProfitBalance result = profitBalanceService.save(profitBalance);
        return ResponseEntity
            .created(new URI("/api/profit-balances/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /profit-balances/:id} : Updates an existing profitBalance.
     *
     * @param id the id of the profitBalance to save.
     * @param profitBalance the profitBalance to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated profitBalance,
     * or with status {@code 400 (Bad Request)} if the profitBalance is not valid,
     * or with status {@code 500 (Internal Server Error)} if the profitBalance couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/profit-balances/{id}")
    public ResponseEntity<ProfitBalance> updateProfitBalance(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ProfitBalance profitBalance
    ) throws URISyntaxException {
        log.debug("REST request to update ProfitBalance : {}, {}", id, profitBalance);
        if (profitBalance.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, profitBalance.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!profitBalanceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ProfitBalance result = profitBalanceService.save(profitBalance);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, profitBalance.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /profit-balances/:id} : Partial updates given fields of an existing profitBalance, field will ignore if it is null
     *
     * @param id the id of the profitBalance to save.
     * @param profitBalance the profitBalance to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated profitBalance,
     * or with status {@code 400 (Bad Request)} if the profitBalance is not valid,
     * or with status {@code 404 (Not Found)} if the profitBalance is not found,
     * or with status {@code 500 (Internal Server Error)} if the profitBalance couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/profit-balances/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ProfitBalance> partialUpdateProfitBalance(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ProfitBalance profitBalance
    ) throws URISyntaxException {
        log.debug("REST request to partial update ProfitBalance partially : {}, {}", id, profitBalance);
        if (profitBalance.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, profitBalance.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!profitBalanceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ProfitBalance> result = profitBalanceService.partialUpdate(profitBalance);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, profitBalance.getId().toString())
        );
    }

    /**
     * {@code GET  /profit-balances} : get all the profitBalances.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of profitBalances in body.
     */
    @GetMapping("/profit-balances")
    public List<ProfitBalance> getAllProfitBalances(@RequestParam(required = false) String filter) {
        if ("idea-is-null".equals(filter)) {
            log.debug("REST request to get all ProfitBalances where idea is null");
            return profitBalanceService.findAllWhereIdeaIsNull();
        }
        log.debug("REST request to get all ProfitBalances");
        return profitBalanceService.findAll();
    }

    /**
     * {@code GET  /profit-balances/:id} : get the "id" profitBalance.
     *
     * @param id the id of the profitBalance to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the profitBalance, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/profit-balances/{id}")
    public ResponseEntity<ProfitBalance> getProfitBalance(@PathVariable Long id) {
        log.debug("REST request to get ProfitBalance : {}", id);
        Optional<ProfitBalance> profitBalance = profitBalanceService.findOne(id);
        return ResponseUtil.wrapOrNotFound(profitBalance);
    }

    /**
     * {@code DELETE  /profit-balances/:id} : delete the "id" profitBalance.
     *
     * @param id the id of the profitBalance to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/profit-balances/{id}")
    public ResponseEntity<Void> deleteProfitBalance(@PathVariable Long id) {
        log.debug("REST request to delete ProfitBalance : {}", id);
        profitBalanceService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
