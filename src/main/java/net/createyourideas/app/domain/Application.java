package net.createyourideas.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Application.
 */
@Entity
@Table(name = "application")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Application implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "title")
    private String title;

    @Lob
    @Column(name = "description")
    private String description;

    @Column(name = "date")
    private ZonedDateTime date;

    @Column(name = "desired_hourly_wage")
    private Float desiredHourlyWage;

    @Column(name = "seen")
    private Boolean seen;

    @Column(name = "responded")
    private Boolean responded;

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

    public Application id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public Application title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return this.description;
    }

    public Application description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ZonedDateTime getDate() {
        return this.date;
    }

    public Application date(ZonedDateTime date) {
        this.setDate(date);
        return this;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public Float getDesiredHourlyWage() {
        return this.desiredHourlyWage;
    }

    public Application desiredHourlyWage(Float desiredHourlyWage) {
        this.setDesiredHourlyWage(desiredHourlyWage);
        return this;
    }

    public void setDesiredHourlyWage(Float desiredHourlyWage) {
        this.desiredHourlyWage = desiredHourlyWage;
    }

    public Boolean getSeen() {
        return this.seen;
    }

    public Application seen(Boolean seen) {
        this.setSeen(seen);
        return this;
    }

    public void setSeen(Boolean seen) {
        this.seen = seen;
    }

    public Boolean getResponded() {
        return this.responded;
    }

    public Application responded(Boolean responded) {
        this.setResponded(responded);
        return this;
    }

    public void setResponded(Boolean responded) {
        this.responded = responded;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Application user(User user) {
        this.setUser(user);
        return this;
    }

    public Idea getIdea() {
        return this.idea;
    }

    public void setIdea(Idea idea) {
        this.idea = idea;
    }

    public Application idea(Idea idea) {
        this.setIdea(idea);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Application)) {
            return false;
        }
        return id != null && id.equals(((Application) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Application{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", description='" + getDescription() + "'" +
            ", date='" + getDate() + "'" +
            ", desiredHourlyWage=" + getDesiredHourlyWage() +
            ", seen='" + getSeen() + "'" +
            ", responded='" + getResponded() + "'" +
            "}";
    }
}
