package net.createyourideas.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ProfitBalance.
 */
@Entity
@Table(name = "profit_balance")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ProfitBalance implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "profit")
    private Float profit;

    @Column(name = "profit_to_spend")
    private Float profitToSpend;

    @Column(name = "net_profit")
    private Float netProfit;

    @Column(name = "date")
    private LocalDate date;

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
    @OneToOne(mappedBy = "profitBalance")
    private Idea idea;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ProfitBalance id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Float getProfit() {
        return this.profit;
    }

    public ProfitBalance profit(Float profit) {
        this.setProfit(profit);
        return this;
    }

    public void setProfit(Float profit) {
        this.profit = profit;
    }

    public Float getProfitToSpend() {
        return this.profitToSpend;
    }

    public ProfitBalance profitToSpend(Float profitToSpend) {
        this.setProfitToSpend(profitToSpend);
        return this;
    }

    public void setProfitToSpend(Float profitToSpend) {
        this.profitToSpend = profitToSpend;
    }

    public Float getNetProfit() {
        return this.netProfit;
    }

    public ProfitBalance netProfit(Float netProfit) {
        this.setNetProfit(netProfit);
        return this;
    }

    public void setNetProfit(Float netProfit) {
        this.netProfit = netProfit;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public ProfitBalance date(LocalDate date) {
        this.setDate(date);
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Idea getIdea() {
        return this.idea;
    }

    public void setIdea(Idea idea) {
        if (this.idea != null) {
            this.idea.setProfitBalance(null);
        }
        if (idea != null) {
            idea.setProfitBalance(this);
        }
        this.idea = idea;
    }

    public ProfitBalance idea(Idea idea) {
        this.setIdea(idea);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProfitBalance)) {
            return false;
        }
        return id != null && id.equals(((ProfitBalance) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProfitBalance{" +
            "id=" + getId() +
            ", profit=" + getProfit() +
            ", profitToSpend=" + getProfitToSpend() +
            ", netProfit=" + getNetProfit() +
            ", date='" + getDate() + "'" +
            "}";
    }
}
