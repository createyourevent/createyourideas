package net.createyourideas.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import net.createyourideas.app.domain.Balance;
import net.createyourideas.app.repository.BalanceExtRepository;
import net.createyourideas.app.repository.BalanceRepository;
import net.createyourideas.app.service.BalanceExtService;
import net.createyourideas.app.service.BalanceService;
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
 * REST controller for managing {@link net.createyourideas.app.domain.Balance}.
 */
@RestController
@RequestMapping("/api")
public class BalanceExtResource {

    private final Logger log = LoggerFactory.getLogger(BalanceExtResource.class);

    private static final String ENTITY_NAME = "balance";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BalanceExtService balanceExtService;

    private final BalanceExtRepository balanceExtRepository;

    public BalanceExtResource(BalanceExtService balanceExtService, BalanceExtRepository balanceExtRepository) {
        this.balanceExtService = balanceExtService;
        this.balanceExtRepository = balanceExtRepository;
    }

    /**
     * {@code GET  /balances/:id} : get the "id" balance.
     *
     * @param id the id of the balance to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the balance, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/balances/queryByIdeaId/{id}")
    public List<Balance> getBalancesByIdeaId(@PathVariable Long id) {
        log.debug("REST request to get Balance : {}", id);
        List<Balance> balances = balanceExtService.findAllByIdeaId(id);
        return balances;
    }


}
