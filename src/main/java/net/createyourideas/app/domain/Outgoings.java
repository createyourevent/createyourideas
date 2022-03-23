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
 * A Outgoings.
 */
@Entity
@Table(name = "outgoings")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Outgoings implements Serializable {

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

    @Column(name = "to_child_idea")
    private Boolean toChildIdea;

    @Column(name = "auto")
    private Boolean auto;

    @ManyToMany
    @JoinTable(
        name = "rel_outgoings__outgoing_ideas",
        joinColumns = @JoinColumn(name = "outgoings_id"),
        inverseJoinColumns = @JoinColumn(name = "outgoing_ideas_id")
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
    private Set<Idea> outgoingIdeas = new HashSet<>();

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

    public Outgoings id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public Outgoings title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return this.description;
    }

    public Outgoings description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ZonedDateTime getDate() {
        return this.date;
    }

    public Outgoings date(ZonedDateTime date) {
        this.setDate(date);
        return this;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public Float getValue() {
        return this.value;
    }

    public Outgoings value(Float value) {
        this.setValue(value);
        return this;
    }

    public void setValue(Float value) {
        this.value = value;
    }

    public Boolean getBilled() {
        return this.billed;
    }

    public Outgoings billed(Boolean billed) {
        this.setBilled(billed);
        return this;
    }

    public void setBilled(Boolean billed) {
        this.billed = billed;
    }

    public Boolean getToChildIdea() {
        return this.toChildIdea;
    }

    public Outgoings toChildIdea(Boolean toChildIdea) {
        this.setToChildIdea(toChildIdea);
        return this;
    }

    public void setToChildIdea(Boolean toChildIdea) {
        this.toChildIdea = toChildIdea;
    }

    public Boolean getAuto() {
        return this.auto;
    }

    public Outgoings auto(Boolean auto) {
        this.setAuto(auto);
        return this;
    }

    public void setAuto(Boolean auto) {
        this.auto = auto;
    }

    public Set<Idea> getOutgoingIdeas() {
        return this.outgoingIdeas;
    }

    public void setOutgoingIdeas(Set<Idea> ideas) {
        this.outgoingIdeas = ideas;
    }

    public Outgoings outgoingIdeas(Set<Idea> ideas) {
        this.setOutgoingIdeas(ideas);
        return this;
    }

    public Outgoings addOutgoingIdeas(Idea idea) {
        this.outgoingIdeas.add(idea);
        idea.getIdeaOutgoings().add(this);
        return this;
    }

    public Outgoings removeOutgoingIdeas(Idea idea) {
        this.outgoingIdeas.remove(idea);
        idea.getIdeaOutgoings().remove(this);
        return this;
    }

    public Idea getIdea() {
        return this.idea;
    }

    public void setIdea(Idea idea) {
        this.idea = idea;
    }

    public Outgoings idea(Idea idea) {
        this.setIdea(idea);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Outgoings)) {
            return false;
        }
        return id != null && id.equals(((Outgoings) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Outgoings{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", description='" + getDescription() + "'" +
            ", date='" + getDate() + "'" +
            ", value=" + getValue() +
            ", billed='" + getBilled() + "'" +
            ", toChildIdea='" + getToChildIdea() + "'" +
            ", auto='" + getAuto() + "'" +
            "}";
    }
}
