package net.createyourideas.app.web.rest;



import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import net.createyourideas.app.domain.ChatMessage;
import net.createyourideas.app.service.ChatMessageService;
import net.createyourideas.app.web.rest.errors.BadRequestAlertException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link org.createyourevent.domain.ChatMessage}.
 */
@RestController
@RequestMapping("/api")
public class ChatMessageResource {

    private final Logger log = LoggerFactory.getLogger(ChatMessageResource.class);

    private static final String ENTITY_NAME = "chatMessage";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ChatMessageService chatMessageService;

    public ChatMessageResource(ChatMessageService chatMessageService) {
        this.chatMessageService = chatMessageService;
    }

    /**
     * {@code POST  /chatMessages} : Create a new chatMessage.
     *
     * @param chatMessage the chatMessage to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new chatMessage, or with status {@code 400 (Bad Request)} if the chatMessage has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/chatMessages")
    public ResponseEntity<ChatMessage> createChatMessage(@RequestBody ChatMessage chatMessage) throws URISyntaxException {
        log.debug("REST request to save ChatMessage : {}", chatMessage);
        if (chatMessage.getId() != null) {
            throw new BadRequestAlertException("A new chatMessage cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ChatMessage result = chatMessageService.save(chatMessage);
        return ResponseEntity.created(new URI("/api/chatMessages/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /chatMessages} : Updates an existing chatMessage.
     *
     * @param chatMessage the chatMessage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated chatMessage,
     * or with status {@code 400 (Bad Request)} if the chatMessage is not valid,
     * or with status {@code 500 (Internal Server Error)} if the chatMessage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/chatMessages")
    public ResponseEntity<ChatMessage> updateChatMessage(@RequestBody ChatMessage chatMessage) throws URISyntaxException {
        log.debug("REST request to update ChatMessage : {}", chatMessage);
        if (chatMessage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ChatMessage result = chatMessageService.save(chatMessage);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, chatMessage.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /chatMessages} : get all the chatMessages.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of chatMessages in body.
     */
    @GetMapping("/chatMessages")
    public ResponseEntity<List<ChatMessage>> getAllChatMessages(Pageable pageable) {
        log.debug("REST request to get a page of ChatMessages");
        Page<ChatMessage> page = chatMessageService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /chatMessages/:id} : get the "id" chatMessage.
     *
     * @param id the id of the chatMessage to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the chatMessage, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/chatMessages/{id}")
    public ResponseEntity<ChatMessage> getChatMessage(@PathVariable Long id) {
        log.debug("REST request to get ChatMessage : {}", id);
        Optional<ChatMessage> chatMessage = chatMessageService.findOne(id);
        return ResponseUtil.wrapOrNotFound(chatMessage);
    }

    /**
     * {@code DELETE  /chatMessages/:id} : delete the "id" chatMessage.
     *
     * @param id the id of the chatMessage to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/chatMessages/{id}")
    public ResponseEntity<Void> deleteChatMessage(@PathVariable Long id) {
        log.debug("REST request to delete ChatMessage : {}", id);
        chatMessageService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }


    /**
     * {@code GET  /chatMessages} : get all the chatMessages.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of chatMessages in body.
     */
    @GetMapping("/chatMessages/{userId}/messageFrom")
    public List<ChatMessage> getAllChatMessagesByMessageFrom(@PathVariable String userId) {
        log.debug("REST request to get a page of ChatMessages");
        List<ChatMessage> messages = chatMessageService.findAllByMessageFrom(userId);
        return messages;
    }

    @GetMapping("/chatMessages/{userToId}/messageToAndDateSeenIsNull")
    public List<ChatMessage> findAllByMessageToAndDateSeenIsNull(@PathVariable String userToId) {
        log.debug("REST request to get a page of ChatMessages");
        List<ChatMessage> messages = chatMessageService.findAllByMessageToAndDateSeenIsNull(userToId);
        return messages;
    }

    @GetMapping("/chatMessages/{toId}/{fromId}/{messageType}/{dateSent}/byMessage")
    public ChatMessage findOneByMessageToAndMessageFromAndMessageTypeAndDateSent(@PathVariable String toId, @PathVariable String fromId, @PathVariable Long messageType, @PathVariable ZonedDateTime dateSent) {
        log.debug("REST request to get a ChatMessage by Message");
        ChatMessage m = chatMessageService.findOneByMessageToAndMessageFromAndMessageTypeAndDateSent(toId, fromId, messageType, dateSent);
        return m;
    }
}
