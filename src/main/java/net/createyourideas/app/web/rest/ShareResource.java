package net.createyourideas.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import net.createyourideas.app.domain.Share;
import net.createyourideas.app.repository.ShareRepository;
import net.createyourideas.app.service.ShareService;
import net.createyourideas.app.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link net.createyourideas.app.domain.Share}.
 */
@RestController
@RequestMapping("/api")
public class ShareResource {

    private final Logger log = LoggerFactory.getLogger(ShareResource.class);

    private static final String ENTITY_NAME = "share";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ShareService shareService;

    private final ShareRepository shareRepository;

    public ShareResource(ShareService shareService, ShareRepository shareRepository) {
        this.shareService = shareService;
        this.shareRepository = shareRepository;
    }

    /**
     * {@code POST  /shares} : Create a new share.
     *
     * @param share the share to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new share, or with status {@code 400 (Bad Request)} if the share has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/shares")
    public ResponseEntity<Share> createShare(@RequestBody Share share) throws URISyntaxException {
        log.debug("REST request to save Share : {}", share);
        if (share.getId() != null) {
            throw new BadRequestAlertException("A new share cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Share result = shareService.save(share);
        return ResponseEntity
            .created(new URI("/api/shares/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /shares/:id} : Updates an existing share.
     *
     * @param id the id of the share to save.
     * @param share the share to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated share,
     * or with status {@code 400 (Bad Request)} if the share is not valid,
     * or with status {@code 500 (Internal Server Error)} if the share couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/shares/{id}")
    public ResponseEntity<Share> updateShare(@PathVariable(value = "id", required = false) final Long id, @RequestBody Share share)
        throws URISyntaxException {
        log.debug("REST request to update Share : {}, {}", id, share);
        if (share.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, share.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!shareRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Share result = shareService.save(share);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, share.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /shares/:id} : Partial updates given fields of an existing share, field will ignore if it is null
     *
     * @param id the id of the share to save.
     * @param share the share to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated share,
     * or with status {@code 400 (Bad Request)} if the share is not valid,
     * or with status {@code 404 (Not Found)} if the share is not found,
     * or with status {@code 500 (Internal Server Error)} if the share couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/shares/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Share> partialUpdateShare(@PathVariable(value = "id", required = false) final Long id, @RequestBody Share share)
        throws URISyntaxException {
        log.debug("REST request to partial update Share partially : {}, {}", id, share);
        if (share.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, share.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!shareRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Share> result = shareService.partialUpdate(share);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, share.getId().toString())
        );
    }

    /**
     * {@code GET  /shares} : get all the shares.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of shares in body.
     */
    @GetMapping("/shares")
    public List<Share> getAllShares() {
        log.debug("REST request to get all Shares");
        return shareService.findAll();
    }

    /**
     * {@code GET  /shares/:id} : get the "id" share.
     *
     * @param id the id of the share to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the share, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/shares/{id}")
    public ResponseEntity<Share> getShare(@PathVariable Long id) {
        log.debug("REST request to get Share : {}", id);
        Optional<Share> share = shareService.findOne(id);
        return ResponseUtil.wrapOrNotFound(share);
    }

    /**
     * {@code DELETE  /shares/:id} : delete the "id" share.
     *
     * @param id the id of the share to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/shares/{id}")
    public ResponseEntity<Void> deleteShare(@PathVariable Long id) {
        log.debug("REST request to delete Share : {}", id);
        shareService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
