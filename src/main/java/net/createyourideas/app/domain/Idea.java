package net.createyourideas.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import net.createyourideas.app.domain.enumeration.Ideatype;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Idea.
 */
@Entity
@Table(name = "idea")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Idea implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "title", nullable = false)
    private String title;

    @Lob
    @Column(name = "logo", nullable = false)
    private byte[] logo;

    @NotNull
    @Column(name = "logo_content_type", nullable = false)
    private String logoContentType;

    @Lob
    @Column(name = "description", nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "ideatype")
    private Ideatype ideatype;

    @NotNull
    @DecimalMin(value = "0")
    @DecimalMax(value = "100")
    @Column(name = "interest", nullable = false)
    private Float interest;

    @NotNull
    @DecimalMin(value = "0")
    @DecimalMax(value = "100")
    @Column(name = "distribution", nullable = false)
    private Float distribution;

    @NotNull
    @Column(name = "investment", nullable = false)
    private Float investment;

    @Column(name = "active")
    private Boolean active;

    @Column(name = "date")
    private ZonedDateTime date;

    @JsonIgnoreProperties(value = { "idea" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private ProfitBalance profitBalance;

    @OneToMany(mappedBy = "idea")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "incomeIdeas", "idea" }, allowSetters = true)
    private Set<Income> incomes = new HashSet<>();

    @OneToMany(mappedBy = "idea")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "outgoingIdeas", "idea" }, allowSetters = true)
    private Set<Outgoings> outgoings = new HashSet<>();

    @OneToMany(mappedBy = "idea")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "employee", "idea" }, allowSetters = true)
    private Set<Worksheet> worksheets = new HashSet<>();

    @OneToMany(mappedBy = "idea")
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
    private Set<Idea> parents = new HashSet<>();

    @OneToMany(mappedBy = "idea")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "idea" }, allowSetters = true)
    private Set<Balance> balances = new HashSet<>();

    @OneToMany(mappedBy = "idea")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "idea" }, allowSetters = true)
    private Set<Donation> donations = new HashSet<>();

    @OneToMany(mappedBy = "idea")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "idea" }, allowSetters = true)
    private Set<Application> applications = new HashSet<>();

    @OneToMany(mappedBy = "idea")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "idea" }, allowSetters = true)
    private Set<MonthlyIncomeInvoice> monthlyIncomeInvoices = new HashSet<>();

    @OneToMany(mappedBy = "idea")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "idea" }, allowSetters = true)
    private Set<MonthlyOutgoingsInvoice> monthlyOutgoingsInvoices = new HashSet<>();

    @ManyToOne
    private User user;

    @ManyToMany
    @JoinTable(
        name = "rel_idea__employees",
        joinColumns = @JoinColumn(name = "idea_id"),
        inverseJoinColumns = @JoinColumn(name = "employees_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "ideas" }, allowSetters = true)
    private Set<Employee> employees = new HashSet<>();

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

    @OneToMany(mappedBy = "idea")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "idea", "user" }, allowSetters = true)
    private Set<IdeaStarRating> ideaStarRatings = new HashSet<>();

    @OneToMany(mappedBy = "idea")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "ideaComments", "idea", "ideaComment" }, allowSetters = true)
    private Set<IdeaComment> ideaComments = new HashSet<>();

    @OneToMany(mappedBy = "idea")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "idea" }, allowSetters = true)
    private Set<IdeaLikeDislike> ideaLikeDislikes = new HashSet<>();

    @ManyToMany(mappedBy = "outgoingIdeas", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "outgoingIdeas", "idea" }, allowSetters = true)
    private Set<Outgoings> ideaOutgoings = new HashSet<>();

    @ManyToMany(mappedBy = "incomeIdeas", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "incomeIdeas", "idea" }, allowSetters = true)
    private Set<Income> ideaIncomes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Idea id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public Idea title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public byte[] getLogo() {
        return this.logo;
    }

    public Idea logo(byte[] logo) {
        this.setLogo(logo);
        return this;
    }

    public void setLogo(byte[] logo) {
        this.logo = logo;
    }

    public String getLogoContentType() {
        return this.logoContentType;
    }

    public Idea logoContentType(String logoContentType) {
        this.logoContentType = logoContentType;
        return this;
    }

    public void setLogoContentType(String logoContentType) {
        this.logoContentType = logoContentType;
    }

    public String getDescription() {
        return this.description;
    }

    public Idea description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Ideatype getIdeatype() {
        return this.ideatype;
    }

    public Idea ideatype(Ideatype ideatype) {
        this.setIdeatype(ideatype);
        return this;
    }

    public void setIdeatype(Ideatype ideatype) {
        this.ideatype = ideatype;
    }

    public Float getInterest() {
        return this.interest;
    }

    public Idea interest(Float interest) {
        this.setInterest(interest);
        return this;
    }

    public void setInterest(Float interest) {
        this.interest = interest;
    }

    public Float getDistribution() {
        return this.distribution;
    }

    public Idea distribution(Float distribution) {
        this.setDistribution(distribution);
        return this;
    }

    public void setDistribution(Float distribution) {
        this.distribution = distribution;
    }

    public Float getInvestment() {
        return this.investment;
    }

    public Idea investment(Float investment) {
        this.setInvestment(investment);
        return this;
    }

    public void setInvestment(Float investment) {
        this.investment = investment;
    }

    public Boolean getActive() {
        return this.active;
    }

    public Idea active(Boolean active) {
        this.setActive(active);
        return this;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public ZonedDateTime getDate() {
        return this.date;
    }

    public Idea date(ZonedDateTime date) {
        this.setDate(date);
        return this;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public ProfitBalance getProfitBalance() {
        return this.profitBalance;
    }

    public void setProfitBalance(ProfitBalance profitBalance) {
        this.profitBalance = profitBalance;
    }

    public Idea profitBalance(ProfitBalance profitBalance) {
        this.setProfitBalance(profitBalance);
        return this;
    }

    public Set<Income> getIncomes() {
        return this.incomes;
    }

    public void setIncomes(Set<Income> incomes) {
        if (this.incomes != null) {
            this.incomes.forEach(i -> i.setIdea(null));
        }
        if (incomes != null) {
            incomes.forEach(i -> i.setIdea(this));
        }
        this.incomes = incomes;
    }

    public Idea incomes(Set<Income> incomes) {
        this.setIncomes(incomes);
        return this;
    }

    public Idea addIncomes(Income income) {
        this.incomes.add(income);
        income.setIdea(this);
        return this;
    }

    public Idea removeIncomes(Income income) {
        this.incomes.remove(income);
        income.setIdea(null);
        return this;
    }

    public Set<Outgoings> getOutgoings() {
        return this.outgoings;
    }

    public void setOutgoings(Set<Outgoings> outgoings) {
        if (this.outgoings != null) {
            this.outgoings.forEach(i -> i.setIdea(null));
        }
        if (outgoings != null) {
            outgoings.forEach(i -> i.setIdea(this));
        }
        this.outgoings = outgoings;
    }

    public Idea outgoings(Set<Outgoings> outgoings) {
        this.setOutgoings(outgoings);
        return this;
    }

    public Idea addOutgoings(Outgoings outgoings) {
        this.outgoings.add(outgoings);
        outgoings.setIdea(this);
        return this;
    }

    public Idea removeOutgoings(Outgoings outgoings) {
        this.outgoings.remove(outgoings);
        outgoings.setIdea(null);
        return this;
    }

    public Set<Worksheet> getWorksheets() {
        return this.worksheets;
    }

    public void setWorksheets(Set<Worksheet> worksheets) {
        if (this.worksheets != null) {
            this.worksheets.forEach(i -> i.setIdea(null));
        }
        if (worksheets != null) {
            worksheets.forEach(i -> i.setIdea(this));
        }
        this.worksheets = worksheets;
    }

    public Idea worksheets(Set<Worksheet> worksheets) {
        this.setWorksheets(worksheets);
        return this;
    }

    public Idea addWorksheets(Worksheet worksheet) {
        this.worksheets.add(worksheet);
        worksheet.setIdea(this);
        return this;
    }

    public Idea removeWorksheets(Worksheet worksheet) {
        this.worksheets.remove(worksheet);
        worksheet.setIdea(null);
        return this;
    }

    public Set<Idea> getParents() {
        return this.parents;
    }

    public void setParents(Set<Idea> ideas) {
        if (this.parents != null) {
            this.parents.forEach(i -> i.setIdea(null));
        }
        if (ideas != null) {
            ideas.forEach(i -> i.setIdea(this));
        }
        this.parents = ideas;
    }

    public Idea parents(Set<Idea> ideas) {
        this.setParents(ideas);
        return this;
    }

    public Idea addParents(Idea idea) {
        this.parents.add(idea);
        idea.setIdea(this);
        return this;
    }

    public Idea removeParents(Idea idea) {
        this.parents.remove(idea);
        idea.setIdea(null);
        return this;
    }

    public Set<Balance> getBalances() {
        return this.balances;
    }

    public void setBalances(Set<Balance> balances) {
        if (this.balances != null) {
            this.balances.forEach(i -> i.setIdea(null));
        }
        if (balances != null) {
            balances.forEach(i -> i.setIdea(this));
        }
        this.balances = balances;
    }

    public Idea balances(Set<Balance> balances) {
        this.setBalances(balances);
        return this;
    }

    public Idea addBalances(Balance balance) {
        this.balances.add(balance);
        balance.setIdea(this);
        return this;
    }

    public Idea removeBalances(Balance balance) {
        this.balances.remove(balance);
        balance.setIdea(null);
        return this;
    }

    public Set<Donation> getDonations() {
        return this.donations;
    }

    public void setDonations(Set<Donation> donations) {
        if (this.donations != null) {
            this.donations.forEach(i -> i.setIdea(null));
        }
        if (donations != null) {
            donations.forEach(i -> i.setIdea(this));
        }
        this.donations = donations;
    }

    public Idea donations(Set<Donation> donations) {
        this.setDonations(donations);
        return this;
    }

    public Idea addDonations(Donation donation) {
        this.donations.add(donation);
        donation.setIdea(this);
        return this;
    }

    public Idea removeDonations(Donation donation) {
        this.donations.remove(donation);
        donation.setIdea(null);
        return this;
    }

    public Set<Application> getApplications() {
        return this.applications;
    }

    public void setApplications(Set<Application> applications) {
        if (this.applications != null) {
            this.applications.forEach(i -> i.setIdea(null));
        }
        if (applications != null) {
            applications.forEach(i -> i.setIdea(this));
        }
        this.applications = applications;
    }

    public Idea applications(Set<Application> applications) {
        this.setApplications(applications);
        return this;
    }

    public Idea addApplications(Application application) {
        this.applications.add(application);
        application.setIdea(this);
        return this;
    }

    public Idea removeApplications(Application application) {
        this.applications.remove(application);
        application.setIdea(null);
        return this;
    }

    public Set<MonthlyIncomeInvoice> getMonthlyIncomeInvoices() {
        return this.monthlyIncomeInvoices;
    }

    public void setMonthlyIncomeInvoices(Set<MonthlyIncomeInvoice> monthlyIncomeInvoices) {
        if (this.monthlyIncomeInvoices != null) {
            this.monthlyIncomeInvoices.forEach(i -> i.setIdea(null));
        }
        if (monthlyIncomeInvoices != null) {
            monthlyIncomeInvoices.forEach(i -> i.setIdea(this));
        }
        this.monthlyIncomeInvoices = monthlyIncomeInvoices;
    }

    public Idea monthlyIncomeInvoices(Set<MonthlyIncomeInvoice> monthlyIncomeInvoices) {
        this.setMonthlyIncomeInvoices(monthlyIncomeInvoices);
        return this;
    }

    public Idea addMonthlyIncomeInvoices(MonthlyIncomeInvoice monthlyIncomeInvoice) {
        this.monthlyIncomeInvoices.add(monthlyIncomeInvoice);
        monthlyIncomeInvoice.setIdea(this);
        return this;
    }

    public Idea removeMonthlyIncomeInvoices(MonthlyIncomeInvoice monthlyIncomeInvoice) {
        this.monthlyIncomeInvoices.remove(monthlyIncomeInvoice);
        monthlyIncomeInvoice.setIdea(null);
        return this;
    }

    public Set<MonthlyOutgoingsInvoice> getMonthlyOutgoingsInvoices() {
        return this.monthlyOutgoingsInvoices;
    }

    public void setMonthlyOutgoingsInvoices(Set<MonthlyOutgoingsInvoice> monthlyOutgoingsInvoices) {
        if (this.monthlyOutgoingsInvoices != null) {
            this.monthlyOutgoingsInvoices.forEach(i -> i.setIdea(null));
        }
        if (monthlyOutgoingsInvoices != null) {
            monthlyOutgoingsInvoices.forEach(i -> i.setIdea(this));
        }
        this.monthlyOutgoingsInvoices = monthlyOutgoingsInvoices;
    }

    public Idea monthlyOutgoingsInvoices(Set<MonthlyOutgoingsInvoice> monthlyOutgoingsInvoices) {
        this.setMonthlyOutgoingsInvoices(monthlyOutgoingsInvoices);
        return this;
    }

    public Idea addMonthlyOutgoingsInvoice(MonthlyOutgoingsInvoice monthlyOutgoingsInvoice) {
        this.monthlyOutgoingsInvoices.add(monthlyOutgoingsInvoice);
        monthlyOutgoingsInvoice.setIdea(this);
        return this;
    }

    public Idea removeMonthlyOutgoingsInvoice(MonthlyOutgoingsInvoice monthlyOutgoingsInvoice) {
        this.monthlyOutgoingsInvoices.remove(monthlyOutgoingsInvoice);
        monthlyOutgoingsInvoice.setIdea(null);
        return this;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Idea user(User user) {
        this.setUser(user);
        return this;
    }

    public Set<Employee> getEmployees() {
        return this.employees;
    }

    public void setEmployees(Set<Employee> employees) {
        this.employees = employees;
    }

    public Idea employees(Set<Employee> employees) {
        this.setEmployees(employees);
        return this;
    }

    public Idea addEmployees(Employee employee) {
        this.employees.add(employee);
        employee.getIdeas().add(this);
        return this;
    }

    public Idea removeEmployees(Employee employee) {
        this.employees.remove(employee);
        employee.getIdeas().remove(this);
        return this;
    }

    public Idea getIdea() {
        return this.idea;
    }

    public void setIdea(Idea idea) {
        this.idea = idea;
    }

    public Idea idea(Idea idea) {
        this.setIdea(idea);
        return this;
    }

    public Set<IdeaStarRating> getIdeaStarRatings() {
        return this.ideaStarRatings;
    }

    public void setIdeaStarRatings(Set<IdeaStarRating> ideaStarRatings) {
        if (this.ideaStarRatings != null) {
            this.ideaStarRatings.forEach(i -> i.setIdea(null));
        }
        if (ideaStarRatings != null) {
            ideaStarRatings.forEach(i -> i.setIdea(this));
        }
        this.ideaStarRatings = ideaStarRatings;
    }

    public Idea ideaStarRatings(Set<IdeaStarRating> ideaStarRatings) {
        this.setIdeaStarRatings(ideaStarRatings);
        return this;
    }

    public Idea addIdeaStarRatings(IdeaStarRating ideaStarRating) {
        this.ideaStarRatings.add(ideaStarRating);
        ideaStarRating.setIdea(this);
        return this;
    }

    public Idea removeIdeaStarRatings(IdeaStarRating ideaStarRating) {
        this.ideaStarRatings.remove(ideaStarRating);
        ideaStarRating.setIdea(null);
        return this;
    }

    public Set<IdeaComment> getIdeaComments() {
        return this.ideaComments;
    }

    public void setIdeaComments(Set<IdeaComment> ideaComments) {
        if (this.ideaComments != null) {
            this.ideaComments.forEach(i -> i.setIdea(null));
        }
        if (ideaComments != null) {
            ideaComments.forEach(i -> i.setIdea(this));
        }
        this.ideaComments = ideaComments;
    }

    public Idea ideaComments(Set<IdeaComment> ideaComments) {
        this.setIdeaComments(ideaComments);
        return this;
    }

    public Idea addIdeaComments(IdeaComment ideaComment) {
        this.ideaComments.add(ideaComment);
        ideaComment.setIdea(this);
        return this;
    }

    public Idea removeIdeaComments(IdeaComment ideaComment) {
        this.ideaComments.remove(ideaComment);
        ideaComment.setIdea(null);
        return this;
    }

    public Set<IdeaLikeDislike> getIdeaLikeDislikes() {
        return this.ideaLikeDislikes;
    }

    public void setIdeaLikeDislikes(Set<IdeaLikeDislike> ideaLikeDislikes) {
        if (this.ideaLikeDislikes != null) {
            this.ideaLikeDislikes.forEach(i -> i.setIdea(null));
        }
        if (ideaLikeDislikes != null) {
            ideaLikeDislikes.forEach(i -> i.setIdea(this));
        }
        this.ideaLikeDislikes = ideaLikeDislikes;
    }

    public Idea ideaLikeDislikes(Set<IdeaLikeDislike> ideaLikeDislikes) {
        this.setIdeaLikeDislikes(ideaLikeDislikes);
        return this;
    }

    public Idea addIdeaLikeDislikes(IdeaLikeDislike ideaLikeDislike) {
        this.ideaLikeDislikes.add(ideaLikeDislike);
        ideaLikeDislike.setIdea(this);
        return this;
    }

    public Idea removeIdeaLikeDislikes(IdeaLikeDislike ideaLikeDislike) {
        this.ideaLikeDislikes.remove(ideaLikeDislike);
        ideaLikeDislike.setIdea(null);
        return this;
    }

    public Set<Outgoings> getIdeaOutgoings() {
        return this.ideaOutgoings;
    }

    public void setIdeaOutgoings(Set<Outgoings> outgoings) {
        if (this.ideaOutgoings != null) {
            this.ideaOutgoings.forEach(i -> i.removeOutgoingIdeas(this));
        }
        if (outgoings != null) {
            outgoings.forEach(i -> i.addOutgoingIdeas(this));
        }
        this.ideaOutgoings = outgoings;
    }

    public Idea ideaOutgoings(Set<Outgoings> outgoings) {
        this.setIdeaOutgoings(outgoings);
        return this;
    }

    public Idea addIdeaOutgoings(Outgoings outgoings) {
        this.ideaOutgoings.add(outgoings);
        outgoings.getOutgoingIdeas().add(this);
        return this;
    }

    public Idea removeIdeaOutgoings(Outgoings outgoings) {
        this.ideaOutgoings.remove(outgoings);
        outgoings.getOutgoingIdeas().remove(this);
        return this;
    }

    public Set<Income> getIdeaIncomes() {
        return this.ideaIncomes;
    }

    public void setIdeaIncomes(Set<Income> incomes) {
        if (this.ideaIncomes != null) {
            this.ideaIncomes.forEach(i -> i.removeIncomeIdeas(this));
        }
        if (incomes != null) {
            incomes.forEach(i -> i.addIncomeIdeas(this));
        }
        this.ideaIncomes = incomes;
    }

    public Idea ideaIncomes(Set<Income> incomes) {
        this.setIdeaIncomes(incomes);
        return this;
    }

    public Idea addIdeaIncomes(Income income) {
        this.ideaIncomes.add(income);
        income.getIncomeIdeas().add(this);
        return this;
    }

    public Idea removeIdeaIncomes(Income income) {
        this.ideaIncomes.remove(income);
        income.getIncomeIdeas().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Idea)) {
            return false;
        }
        return id != null && id.equals(((Idea) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Idea{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", logo='" + getLogo() + "'" +
            ", logoContentType='" + getLogoContentType() + "'" +
            ", description='" + getDescription() + "'" +
            ", ideatype='" + getIdeatype() + "'" +
            ", interest=" + getInterest() +
            ", distribution=" + getDistribution() +
            ", investment=" + getInvestment() +
            ", active='" + getActive() + "'" +
            ", date='" + getDate() + "'" +
            "}";
    }
}
