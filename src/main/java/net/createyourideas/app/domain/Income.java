package net.createyourideas.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Income.
 */
@Entity
@Table(name = "income")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Income implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "title", nullable = false)
    private String title;

    @NotNull
    @Column(name = "description", nullable = false)
    private String description;

    @NotNull
    @Column(name = "date", nullable = false)
    private ZonedDateTime date;

    @NotNull
    @Column(name = "value", nullable = false)
    private Float value;

    @Column(name = "billed")
    private Boolean billed;

    @Column(name = "from_parent_idea")
    private Boolean fromParentIdea;

    @Column(name = "auto")
    private Boolean auto;

    @ManyToMany
    @JoinTable(
        name = "rel_income__income_ideas",
        joinColumns = @JoinColumn(name = "income_id"),
        inverseJoinColumns = @JoinColumn(name = "income_ideas_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
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
    private Set<Idea> incomeIdeas = new HashSet<>();

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

    public Income id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public Income title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return this.description;
    }

    public Income description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ZonedDateTime getDate() {
        return this.date;
    }

    public Income date(ZonedDateTime date) {
        this.setDate(date);
        return this;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public Float getValue() {
        return this.value;
    }

    public Income value(Float value) {
        this.setValue(value);
        return this;
    }

    public void setValue(Float value) {
        this.value = value;
    }

    public Boolean getBilled() {
        return this.billed;
    }

    public Income billed(Boolean billed) {
        this.setBilled(billed);
        return this;
    }

    public void setBilled(Boolean billed) {
        this.billed = billed;
    }

    public Boolean getFromParentIdea() {
        return this.fromParentIdea;
    }

    public Income fromParentIdea(Boolean fromParentIdea) {
        this.setFromParentIdea(fromParentIdea);
        return this;
    }

    public void setFromParentIdea(Boolean fromParentIdea) {
        this.fromParentIdea = fromParentIdea;
    }

    public Boolean getAuto() {
        return this.auto;
    }

    public Income auto(Boolean auto) {
        this.setAuto(auto);
        return this;
    }

    public void setAuto(Boolean auto) {
        this.auto = auto;
    }

    public Set<Idea> getIncomeIdeas() {
        return this.incomeIdeas;
    }

    public void setIncomeIdeas(Set<Idea> ideas) {
        this.incomeIdeas = ideas;
    }

    public Income incomeIdeas(Set<Idea> ideas) {
        this.setIncomeIdeas(ideas);
        return this;
    }

    public Income addIncomeIdeas(Idea idea) {
        this.incomeIdeas.add(idea);
        idea.getIdeaIncomes().add(this);
        return this;
    }

    public Income removeIncomeIdeas(Idea idea) {
        this.incomeIdeas.remove(idea);
        idea.getIdeaIncomes().remove(this);
        return this;
    }

    public Idea getIdea() {
        return this.idea;
    }

    public void setIdea(Idea idea) {
        this.idea = idea;
    }

    public Income idea(Idea idea) {
        this.setIdea(idea);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Income)) {
            return false;
        }
        return id != null && id.equals(((Income) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Income{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", description='" + getDescription() + "'" +
            ", date='" + getDate() + "'" +
            ", value=" + getValue() +
            ", billed='" + getBilled() + "'" +
            ", fromParentIdea='" + getFromParentIdea() + "'" +
            ", auto='" + getAuto() + "'" +
            "}";
    }
}
