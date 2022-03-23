package net.createyourideas.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Employee.
 */
@Entity
@Table(name = "employee")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Employee implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "hourly_wages")
    private Float hourlyWages;

    @Column(name = "date")
    private ZonedDateTime date;

    @ManyToOne
    private User user;

    @OneToMany(mappedBy = "employee")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "employee", "idea" }, allowSetters = true)
    private Set<Worksheet> worksheets = new HashSet<>();

    @ManyToMany(mappedBy = "employees")
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
    private Set<Idea> ideas = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Employee id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Float getHourlyWages() {
        return this.hourlyWages;
    }

    public Employee hourlyWages(Float hourlyWages) {
        this.setHourlyWages(hourlyWages);
        return this;
    }

    public void setHourlyWages(Float hourlyWages) {
        this.hourlyWages = hourlyWages;
    }

    public ZonedDateTime getDate() {
        return this.date;
    }

    public Employee date(ZonedDateTime date) {
        this.setDate(date);
        return this;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Employee user(User user) {
        this.setUser(user);
        return this;
    }

    public Set<Worksheet> getWorksheets() {
        return this.worksheets;
    }

    public void setWorksheets(Set<Worksheet> worksheets) {
        if (this.worksheets != null) {
            this.worksheets.forEach(i -> i.setEmployee(null));
        }
        if (worksheets != null) {
            worksheets.forEach(i -> i.setEmployee(this));
        }
        this.worksheets = worksheets;
    }

    public Employee worksheets(Set<Worksheet> worksheets) {
        this.setWorksheets(worksheets);
        return this;
    }

    public Employee addWorksheets(Worksheet worksheet) {
        this.worksheets.add(worksheet);
        worksheet.setEmployee(this);
        return this;
    }

    public Employee removeWorksheets(Worksheet worksheet) {
        this.worksheets.remove(worksheet);
        worksheet.setEmployee(null);
        return this;
    }

    public Set<Idea> getIdeas() {
        return this.ideas;
    }

    public void setIdeas(Set<Idea> ideas) {
        if (this.ideas != null) {
            this.ideas.forEach(i -> i.removeEmployees(this));
        }
        if (ideas != null) {
            ideas.forEach(i -> i.addEmployees(this));
        }
        this.ideas = ideas;
    }

    public Employee ideas(Set<Idea> ideas) {
        this.setIdeas(ideas);
        return this;
    }

    public Employee addIdeas(Idea idea) {
        this.ideas.add(idea);
        idea.getEmployees().add(this);
        return this;
    }

    public Employee removeIdeas(Idea idea) {
        this.ideas.remove(idea);
        idea.getEmployees().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Employee)) {
            return false;
        }
        return id != null && id.equals(((Employee) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Employee{" +
            "id=" + getId() +
            ", hourlyWages=" + getHourlyWages() +
            ", date='" + getDate() + "'" +
            "}";
    }
}
