package net.createyourideas.app.service.impl;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import net.createyourideas.app.domain.ChatMessage;
import net.createyourideas.app.repository.ChatMessageRepository;
import net.createyourideas.app.service.ChatMessageService;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link ChatMessage}.
 */
@Service
@Transactional
public class ChatMessageServiceImpl implements ChatMessageService {

    private final Logger log = LoggerFactory.getLogger(ChatMessageServiceImpl.class);

    private final ChatMessageRepository chatMessageRepository;

    public ChatMessageServiceImpl(ChatMessageRepository chatMessageRepository) {
        this.chatMessageRepository = chatMessageRepository;
    }

    /**
     * Save a chatMessage.
     *
     * @param chatMessage the entity to save.
     * @return the persisted entity.
     */
    @Override
    public ChatMessage save(ChatMessage chatMessage) {
        log.debug("Request to save ChatMessage : {}", chatMessage);
        return chatMessageRepository.save(chatMessage);
    }

    /**
     * Get all the chatMessages.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<ChatMessage> findAll(Pageable pageable) {
        log.debug("Request to get all ChatMessages");
        return chatMessageRepository.findAll(pageable);
    }

    /**
     * Get one chatMessage by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<ChatMessage> findOne(Long id) {
        log.debug("Request to get ChatMessage : {}", id);
        return chatMessageRepository.findById(id);
    }

    /**
     * Delete the chatMessage by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete ChatMessage : {}", id);
        chatMessageRepository.deleteById(id);
    }

    @Override
    public List<ChatMessage> findAllByMessageFrom(String userId) {
        return chatMessageRepository.findAllByMessageFrom(userId);
    }

    @Override
    public List<ChatMessage> findAllByMessageToAndDateSeenIsNull(String userToId) {
        log.debug("Request to findAllByMessageToAndDateSeenIsNull in ChatMessage : {}", userToId);
        return chatMessageRepository.findByMessageToAndDateSeenIsNull(userToId);
    }

    @Override
    public ChatMessage findOneByMessageToAndMessageFromAndMessageTypeAndDateSent(String toId, String fromId, Long messageType, ZonedDateTime dateSent) {
        return chatMessageRepository.findOneByMessageToAndMessageFromAndMessageTypeAndDateSent(toId, fromId, messageType, dateSent);
    }
}































