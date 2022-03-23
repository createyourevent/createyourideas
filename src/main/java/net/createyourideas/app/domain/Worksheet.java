package net.createyourideas.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Duration;
import java.time.ZonedDateTime;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Worksheet.
 */
@Entity
@Table(name = "worksheet")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Worksheet implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "jobtitle", nullable = false)
    private String jobtitle;

    @Lob
    @Column(name = "jobdescription", nullable = false)
    private String jobdescription;

    @Column(name = "date_start")
    private ZonedDateTime dateStart;

    @Column(name = "date_end")
    private ZonedDateTime dateEnd;

    @NotNull
    @Column(name = "cost_hour", nullable = false)
    private Float costHour;

    @Column(name = "hours")
    private Duration hours;

    @Column(name = "total")
    private Float total;

    @Column(name = "billed")
    private Boolean billed;

    @Column(name = "auto")
    private Boolean auto;

    @ManyToOne
    @JsonIgnoreProperties(value = { "user", "worksheets", "ideas" }, allowSetters = true)
    private Employee employee;

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

    public Worksheet id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getJobtitle() {
        return this.jobtitle;
    }

    public Worksheet jobtitle(String jobtitle) {
        this.setJobtitle(jobtitle);
        return this;
    }

    public void setJobtitle(String jobtitle) {
        this.jobtitle = jobtitle;
    }

    public String getJobdescription() {
        return this.jobdescription;
    }

    public Worksheet jobdescription(String jobdescription) {
        this.setJobdescription(jobdescription);
        return this;
    }

    public void setJobdescription(String jobdescription) {
        this.jobdescription = jobdescription;
    }

    public ZonedDateTime getDateStart() {
        return this.dateStart;
    }

    public Worksheet dateStart(ZonedDateTime dateStart) {
        this.setDateStart(dateStart);
        return this;
    }

    public void setDateStart(ZonedDateTime dateStart) {
        this.dateStart = dateStart;
    }

    public ZonedDateTime getDateEnd() {
        return this.dateEnd;
    }

    public Worksheet dateEnd(ZonedDateTime dateEnd) {
        this.setDateEnd(dateEnd);
        return this;
    }

    public void setDateEnd(ZonedDateTime dateEnd) {
        this.dateEnd = dateEnd;
    }

    public Float getCostHour() {
        return this.costHour;
    }

    public Worksheet costHour(Float costHour) {
        this.setCostHour(costHour);
        return this;
    }

    public void setCostHour(Float costHour) {
        this.costHour = costHour;
    }

    public Duration getHours() {
        return this.hours;
    }

    public Worksheet hours(Duration hours) {
        this.setHours(hours);
        return this;
    }

    public void setHours(Duration hours) {
        this.hours = hours;
    }

    public Float getTotal() {
        return this.total;
    }

    public Worksheet total(Float total) {
        this.setTotal(total);
        return this;
    }

    public void setTotal(Float total) {
        this.total = total;
    }

    public Boolean getBilled() {
        return this.billed;
    }

    public Worksheet billed(Boolean billed) {
        this.setBilled(billed);
        return this;
    }

    public void setBilled(Boolean billed) {
        this.billed = billed;
    }

    public Boolean getAuto() {
        return this.auto;
    }

    public Worksheet auto(Boolean auto) {
        this.setAuto(auto);
        return this;
    }

    public void setAuto(Boolean auto) {
        this.auto = auto;
    }

    public Employee getEmployee() {
        return this.employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Worksheet employee(Employee employee) {
        this.setEmployee(employee);
        return this;
    }

    public Idea getIdea() {
        return this.idea;
    }

    public void setIdea(Idea idea) {
        this.idea = idea;
    }

    public Worksheet idea(Idea idea) {
        this.setIdea(idea);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Worksheet)) {
            return false;
        }
        return id != null && id.equals(((Worksheet) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Worksheet{" +
            "id=" + getId() +
            ", jobtitle='" + getJobtitle() + "'" +
            ", jobdescription='" + getJobdescription() + "'" +
            ", dateStart='" + getDateStart() + "'" +
            ", dateEnd='" + getDateEnd() + "'" +
            ", costHour=" + getCostHour() +
            ", hours='" + getHours() + "'" +
            ", total=" + getTotal() +
            ", billed='" + getBilled() + "'" +
            ", auto='" + getAuto() + "'" +
            "}";
    }
}
