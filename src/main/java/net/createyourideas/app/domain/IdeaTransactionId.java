package net.createyourideas.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A IdeaTransactionId.
 */
@Entity
@Table(name = "idea_transaction_id")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class IdeaTransactionId implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "transaction_id")
    private String transactionId;

    @Column(name = "ref_no")
    private String refNo;

    @Column(name = "date")
    private ZonedDateTime date;

    @JsonIgnoreProperties(value = { "txId", "user", "idea" }, allowSetters = true)
    @OneToOne(mappedBy = "txId")
    private Donation idea;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public IdeaTransactionId id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTransactionId() {
        return this.transactionId;
    }

    public IdeaTransactionId transactionId(String transactionId) {
        this.setTransactionId(transactionId);
        return this;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public String getRefNo() {
        return this.refNo;
    }

    public IdeaTransactionId refNo(String refNo) {
        this.setRefNo(refNo);
        return this;
    }

    public void setRefNo(String refNo) {
        this.refNo = refNo;
    }

    public ZonedDateTime getDate() {
        return this.date;
    }

    public IdeaTransactionId date(ZonedDateTime date) {
        this.setDate(date);
        return this;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public Donation getIdea() {
        return this.idea;
    }

    public void setIdea(Donation donation) {
        if (this.idea != null) {
            this.idea.setTxId(null);
        }
        if (donation != null) {
            donation.setTxId(this);
        }
        this.idea = donation;
    }

    public IdeaTransactionId idea(Donation donation) {
        this.setIdea(donation);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof IdeaTransactionId)) {
            return false;
        }
        return id != null && id.equals(((IdeaTransactionId) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "IdeaTransactionId{" +
            "id=" + getId() +
            ", transactionId='" + getTransactionId() + "'" +
            ", refNo='" + getRefNo() + "'" +
            ", date='" + getDate() + "'" +
            "}";
    }
}
