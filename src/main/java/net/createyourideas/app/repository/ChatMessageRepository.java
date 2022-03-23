package net.createyourideas.app.repository;



import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import net.createyourideas.app.domain.ChatMessage;

import java.time.ZonedDateTime;
import java.util.List;

/**
 * Spring Data  repository for the Shop entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findAllByMessageFrom(String userId);
    List<ChatMessage> findByMessageToAndDateSeenIsNull(String userToId);
    ChatMessage findOneByMessageToAndMessageFromAndMessageTypeAndDateSent(String toId, String fromId, Long messageType, ZonedDateTime dateSent);
}
