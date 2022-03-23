package net.createyourideas.app.domain;

import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A UserPointAssociation.
 */
@Entity
@Table(name = "user_point_association")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class UserPointAssociation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "date")
    private ZonedDateTime date;

    @ManyToOne
    private Point points;

    @ManyToOne
    private User users;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public UserPointAssociation id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getDate() {
        return this.date;
    }

    public UserPointAssociation date(ZonedDateTime date) {
        this.setDate(date);
        return this;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public Point getPoints() {
        return this.points;
    }

    public void setPoints(Point point) {
        this.points = point;
    }

    public UserPointAssociation points(Point point) {
        this.setPoints(point);
        return this;
    }

    public User getUsers() {
        return this.users;
    }

    public void setUsers(User user) {
        this.users = user;
    }

    public UserPointAssociation users(User user) {
        this.setUsers(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserPointAssociation)) {
            return false;
        }
        return id != null && id.equals(((UserPointAssociation) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserPointAssociation{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            "}";
    }
}
