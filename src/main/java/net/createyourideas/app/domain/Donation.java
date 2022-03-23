package net.createyourideas.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Donation.
 */
@Entity
@Table(name = "donation")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Donation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "amount")
    private Float amount;

    @Column(name = "date")
    private ZonedDateTime date;

    @Column(name = "billed")
    private Boolean billed;

    @JsonIgnoreProperties(value = { "idea" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private IdeaTransactionId txId;

    @ManyToOne
    private User user;

    @ManyToOne
    @JsonIgnoreProperties(
        value = {
            "profitBalance",
            "incomes",
            "outgoings",
            "worksheets",
            "parents",
            "balances",
            "donations",
            "applications",
            "monthlyIncomeInvoices",
            "monthlyOutgoingsInvoices",
            "user",
            "employees",
            "idea",
            "ideaStarRatings",
            "ideaComments",
            "ideaLikeDislikes",
            "ideaOutgoings",
            "ideaIncomes",
        },
        allowSetters = true
    )
    private Idea idea;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Donation id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Float getAmount() {
        return this.amount;
    }

    public Donation amount(Float amount) {
        this.setAmount(amount);
        return this;
    }

    public void setAmount(Float amount) {
        this.amount = amount;
    }

    public ZonedDateTime getDate() {
        return this.date;
    }

    public Donation date(ZonedDateTime date) {
        this.setDate(date);
        return this;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public Boolean getBilled() {
        return this.billed;
    }

    public Donation billed(Boolean billed) {
        this.setBilled(billed);
        return this;
    }

    public void setBilled(Boolean billed) {
        this.billed = billed;
    }

    public IdeaTransactionId getTxId() {
        return this.txId;
    }

    public void setTxId(IdeaTransactionId ideaTransactionId) {
        this.txId = ideaTransactionId;
    }

    public Donation txId(IdeaTransactionId ideaTransactionId) {
        this.setTxId(ideaTransactionId);
        return this;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Donation user(User user) {
        this.setUser(user);
        return this;
    }

    public Idea getIdea() {
        return this.idea;
    }

    public void setIdea(Idea idea) {
        this.idea = idea;
    }

    public Donation idea(Idea idea) {
        this.setIdea(idea);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Donation)) {
            return false;
        }
        return id != null && id.equals(((Donation) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Donation{" +
            "id=" + getId() +
            ", amount=" + getAmount() +
            ", date='" + getDate() + "'" +
            ", billed='" + getBilled() + "'" +
            "}";
    }
}
