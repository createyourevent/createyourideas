package net.createyourideas.app.service;



import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import net.createyourideas.app.domain.ChatMessage;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link ChatMessage}.
 */
public interface ChatMessageService {

    /**
     * Save a chatMessage.
     *
     * @param chatMessage the entity to save.
     * @return the persisted entity.
     */
    ChatMessage save(ChatMessage chatMessage);

    /**
     * Get all the chatMessages.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<ChatMessage> findAll(Pageable pageable);

    /**
     * Get the "id" chatMessage.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ChatMessage> findOne(Long id);

    /**
     * Delete the "id" chatMessage.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    List<ChatMessage> findAllByMessageFrom(String userId);

    List<ChatMessage> findAllByMessageToAndDateSeenIsNull(String userToId);

    ChatMessage findOneByMessageToAndMessageFromAndMessageTypeAndDateSent(String toId, String fromId, Long messageType, ZonedDateTime dateSent);
}
