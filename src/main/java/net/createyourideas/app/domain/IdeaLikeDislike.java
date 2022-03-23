package net.createyourideas.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A IdeaLikeDislike.
 */
@Entity
@Table(name = "idea_like_dislike")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class IdeaLikeDislike implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "jhi_like")
    private Integer like;

    @Column(name = "dislike")
    private Integer dislike;

    @Column(name = "date")
    private ZonedDateTime date;

    @Column(name = "comment")
    private String comment;

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

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public IdeaLikeDislike id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getLike() {
        return this.like;
    }

    public IdeaLikeDislike like(Integer like) {
        this.setLike(like);
        return this;
    }

    public void setLike(Integer like) {
        this.like = like;
    }

    public Integer getDislike() {
        return this.dislike;
    }

    public IdeaLikeDislike dislike(Integer dislike) {
        this.setDislike(dislike);
        return this;
    }

    public void setDislike(Integer dislike) {
        this.dislike = dislike;
    }

    public ZonedDateTime getDate() {
        return this.date;
    }

    public IdeaLikeDislike date(ZonedDateTime date) {
        this.setDate(date);
        return this;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public String getComment() {
        return this.comment;
    }

    public IdeaLikeDislike comment(String comment) {
        this.setComment(comment);
        return this;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Idea getIdea() {
        return this.idea;
    }

    public void setIdea(Idea idea) {
        this.idea = idea;
    }

    public IdeaLikeDislike idea(Idea idea) {
        this.setIdea(idea);
        return this;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public IdeaLikeDislike user(User user) {
        this.setUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof IdeaLikeDislike)) {
            return false;
        }
        return id != null && id.equals(((IdeaLikeDislike) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "IdeaLikeDislike{" +
            "id=" + getId() +
            ", like=" + getLike() +
            ", dislike=" + getDislike() +
            ", date='" + getDate() + "'" +
            ", comment='" + getComment() + "'" +
            "}";
    }
}
