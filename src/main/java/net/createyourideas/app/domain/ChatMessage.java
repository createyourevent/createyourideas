package net.createyourideas.app.domain;

import java.io.Serializable;
import java.time.ZonedDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Chat-Message
 */
@Entity
@Table(name = "jhi_chat_message")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class ChatMessage implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "message_type")
    private Long messageType;

    @Column(name = "message_from")
    private String messageFrom;

    @Column(name = "message_to")
    private String messageTo;

    @Column(name = "message")
    private String message;

    @Column(name = "date_sent")
    private ZonedDateTime dateSent;

    @Column(name = "date_seen")
    private ZonedDateTime dateSeen;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getMessageType() {
        return messageType;
    }

    public void setMessageType(Long messageType) {
        this.messageType = messageType;
    }

    public String getMessageFrom() {
        return messageFrom;
    }

    public void setMessageFrom(String messageFrom) {
        this.messageFrom = messageFrom;
    }

    public String getMessageTo() {
        return messageTo;
    }

    public void setMessageTo(String messageTo) {
        this.messageTo = messageTo;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public ZonedDateTime getDateSent() {
        return dateSent;
    }

    public void setDateSent(ZonedDateTime dateSent) {
        this.dateSent = dateSent;
    }

    public ZonedDateTime getDateSeen() {
        return dateSeen;
    }

    public void setDateSeen(ZonedDateTime dateSeen) {
        this.dateSeen = dateSeen;
    }



}
