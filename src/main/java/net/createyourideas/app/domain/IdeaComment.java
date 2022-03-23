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
 * A IdeaComment.
 */
@Entity
@Table(name = "idea_comment")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class IdeaComment implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "comment")
    private String comment;

    @Column(name = "date")
    private ZonedDateTime date;

    @OneToMany(mappedBy = "ideaComment")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "ideaComments", "idea", "user", "ideaComment" }, allowSetters = true)
    private Set<IdeaComment> ideaComments = new HashSet<>();

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

    @ManyToOne
    private User user;

    @ManyToOne
    @JsonIgnoreProperties(value = { "ideaComments", "idea", "user", "ideaComment" }, allowSetters = true)
    private IdeaComment ideaComment;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public IdeaComment id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getComment() {
        return this.comment;
    }

    public IdeaComment comment(String comment) {
        this.setComment(comment);
        return this;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public ZonedDateTime getDate() {
        return this.date;
    }

    public IdeaComment date(ZonedDateTime date) {
        this.setDate(date);
        return this;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public Set<IdeaComment> getIdeaComments() {
        return this.ideaComments;
    }

    public void setIdeaComments(Set<IdeaComment> ideaComments) {
        if (this.ideaComments != null) {
            this.ideaComments.forEach(i -> i.setIdeaComment(null));
        }
        if (ideaComments != null) {
            ideaComments.forEach(i -> i.setIdeaComment(this));
        }
        this.ideaComments = ideaComments;
    }

    public IdeaComment ideaComments(Set<IdeaComment> ideaComments) {
        this.setIdeaComments(ideaComments);
        return this;
    }

    public IdeaComment addIdeaComments(IdeaComment ideaComment) {
        this.ideaComments.add(ideaComment);
        ideaComment.setIdeaComment(this);
        return this;
    }

    public IdeaComment removeIdeaComments(IdeaComment ideaComment) {
        this.ideaComments.remove(ideaComment);
        ideaComment.setIdeaComment(null);
        return this;
    }

    public Idea getIdea() {
        return this.idea;
    }

    public void setIdea(Idea idea) {
        this.idea = idea;
    }

    public IdeaComment idea(Idea idea) {
        this.setIdea(idea);
        return this;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public IdeaComment user(User user) {
        this.setUser(user);
        return this;
    }

    public IdeaComment getIdeaComment() {
        return this.ideaComment;
    }

    public void setIdeaComment(IdeaComment ideaComment) {
        this.ideaComment = ideaComment;
    }

    public IdeaComment ideaComment(IdeaComment ideaComment) {
        this.setIdeaComment(ideaComment);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof IdeaComment)) {
            return false;
        }
        return id != null && id.equals(((IdeaComment) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "IdeaComment{" +
            "id=" + getId() +
            ", comment='" + getComment() + "'" +
            ", date='" + getDate() + "'" +
            "}";
    }
}
