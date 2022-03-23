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

import net.createyourideas.app.domain.Idea;
import net.createyourideas.app.domain.Income;
import net.createyourideas.app.repository.IncomeExtRepository;
import net.createyourideas.app.repository.IncomeRepository;
import net.createyourideas.app.service.IncomeExtService;
import net.createyourideas.app.service.IncomeService;
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
 * REST controller for managing {@link net.createyourideas.app.domain.Income}.
 */
@RestController
@RequestMapping("/api")
public class IncomeExtResource{

    private final Logger log = LoggerFactory.getLogger(IncomeResource.class);

    private static final String ENTITY_NAME = "income";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final IncomeExtService incomeExtService;

    private final IncomeExtRepository incomeExtRepository;

    public IncomeExtResource(IncomeExtService incomeExtService, IncomeExtRepository incomeExtRepository) {
        this.incomeExtService = incomeExtService;
        this.incomeExtRepository = incomeExtRepository;
    }

    @GetMapping("/incomes/{id}/allByIdeaId")
    public List<Income> getIdea(@PathVariable Long id) {
        log.debug("REST request to get Idea : {}", id);
        List<Income> incomes = incomeExtService.findAllByIdeaId(id);
        return incomes;
    }

    @GetMapping("/incomes/{id}/date")
    public List<Income> findAllIncomeByIdeaIdAndDate(@PathVariable Long id, @RequestParam String date) {
        log.debug("REST request to get Income with id and date.");
        ZonedDateTime f = ZonedDateTime.now();
        try {
            f = ZonedDateTime.parse(java.net.URLDecoder.decode(date, "UTF-8"));
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        List<Income> incomes = incomeExtService.findAllIncomeByIdeaIdAndDate(id, f);
        return incomes;
    }
}
