package net.createyourideas.app.web.rest;

import java.util.List;
import java.util.Optional;

import net.createyourideas.app.domain.Idea;
import net.createyourideas.app.service.BalanceService;
import net.createyourideas.app.service.CalcService;
import net.createyourideas.app.service.IdeaAdditionService;
import net.createyourideas.app.service.IdeaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

import org.springframework.web.bind.annotation.*;

/**
 * REST controller for managing
 * {@link net.createyourideas.accounting.domain.Idea}.
 */
@RestController
@RequestMapping("/api")
public class IdeaAdditionResource {

    private final Logger log = LoggerFactory.getLogger(IdeaAdditionResource.class);

    private final IdeaService ideaService;

    private final IdeaAdditionService ideaAdditionService;

    private final CalcService calcService;

    private final BalanceService balanceService;

    public IdeaAdditionResource(IdeaService ideaService, IdeaAdditionService ideaAdditionService, CalcService calcService, BalanceService balanceService) {
        this.ideaService = ideaService;
        this.ideaAdditionService = ideaAdditionService;
        this.calcService = calcService;
        this.balanceService = balanceService;
    }

    @GetMapping("/ideas/user")
    public ResponseEntity<List<Idea>> getAllIdeasByCurrentUser(Pageable pageable) {
        log.debug("REST request to get a page of Ideas from current user");
        Page<Idea> page = ideaAdditionService.findByUserIsCurrentUser(pageable);
        HttpHeaders headers = PaginationUtil
                .generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    @GetMapping("/ideas/{id}/allById")
    public ResponseEntity<List<Idea>> getAllIdeasById(@PathVariable Long id, Pageable pageable) {
        log.debug("REST request to get a page of Ideas by id");
        Page<Idea> page = ideaAdditionService.findAllById(id, pageable);
        HttpHeaders headers = PaginationUtil
                .generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

         /**
     * {@code GET  /ideas/:nodeid} : get the idea with nodeid.
     *
     * @param nodeid the id of the idea to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the idea, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/ideas/{nodeId}/allByNodeId")
    public ResponseEntity<Idea> getIdeaByNode(@PathVariable Long nodeId) {
        log.debug("REST request to get Idea with nodeId : {}", nodeId);
        Optional<Idea> idea = ideaService.findOne(nodeId);
        return ResponseUtil.wrapOrNotFound(idea);
    }


}
