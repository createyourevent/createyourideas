package net.createyourideas.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Balance.
 */
@Entity
@Table(name = "balance")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Balance implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "daily_balance")
    private Float dailyBalance;

    @Column(name = "net_profit")
    private Float netProfit;

    @Column(name = "date")
    private ZonedDateTime date;

    @Column(name = "billed")
    private Boolean billed;

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

    public Balance id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Float getDailyBalance() {
        return this.dailyBalance;
    }

    public Balance dailyBalance(Float dailyBalance) {
        this.setDailyBalance(dailyBalance);
        return this;
    }

    public void setDailyBalance(Float dailyBalance) {
        this.dailyBalance = dailyBalance;
    }

    public Float getNetProfit() {
        return this.netProfit;
    }

    public Balance netProfit(Float netProfit) {
        this.setNetProfit(netProfit);
        return this;
    }

    public void setNetProfit(Float netProfit) {
        this.netProfit = netProfit;
    }

    public ZonedDateTime getDate() {
        return this.date;
    }

    public Balance date(ZonedDateTime date) {
        this.setDate(date);
        return this;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public Boolean getBilled() {
        return this.billed;
    }

    public Balance billed(Boolean billed) {
        this.setBilled(billed);
        return this;
    }

    public void setBilled(Boolean billed) {
        this.billed = billed;
    }

    public Idea getIdea() {
        return this.idea;
    }

    public void setIdea(Idea idea) {
        this.idea = idea;
    }

    public Balance idea(Idea idea) {
        this.setIdea(idea);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Balance)) {
            return false;
        }
        return id != null && id.equals(((Balance) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Balance{" +
            "id=" + getId() +
            ", dailyBalance=" + getDailyBalance() +
            ", netProfit=" + getNetProfit() +
            ", date='" + getDate() + "'" +
            ", billed='" + getBilled() + "'" +
            "}";
    }
}
