package net.createyourideas.app.domain;

import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import net.createyourideas.app.domain.enumeration.PointsCategory;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Point.
 */
@Entity
@Table(name = "point")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Point implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "jhi_key")
    private String key;

    @Column(name = "name")
    private String name;

    @Column(name = "key_name")
    private String keyName;

    @Lob
    @Column(name = "description")
    private String description;

    @Column(name = "key_description")
    private String keyDescription;

    @Enumerated(EnumType.STRING)
    @Column(name = "category")
    private PointsCategory category;

    @Column(name = "points")
    private Long points;

    @Column(name = "count_per_day")
    private Long countPerDay;

    @Column(name = "creation_date")
    private ZonedDateTime creationDate;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Point id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getKey() {
        return this.key;
    }

    public Point key(String key) {
        this.setKey(key);
        return this;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getName() {
        return this.name;
    }

    public Point name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getKeyName() {
        return this.keyName;
    }

    public Point keyName(String keyName) {
        this.setKeyName(keyName);
        return this;
    }

    public void setKeyName(String keyName) {
        this.keyName = keyName;
    }

    public String getDescription() {
        return this.description;
    }

    public Point description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getKeyDescription() {
        return this.keyDescription;
    }

    public Point keyDescription(String keyDescription) {
        this.setKeyDescription(keyDescription);
        return this;
    }

    public void setKeyDescription(String keyDescription) {
        this.keyDescription = keyDescription;
    }

    public PointsCategory getCategory() {
        return this.category;
    }

    public Point category(PointsCategory category) {
        this.setCategory(category);
        return this;
    }

    public void setCategory(PointsCategory category) {
        this.category = category;
    }

    public Long getPoints() {
        return this.points;
    }

    public Point points(Long points) {
        this.setPoints(points);
        return this;
    }

    public void setPoints(Long points) {
        this.points = points;
    }

    public Long getCountPerDay() {
        return this.countPerDay;
    }

    public Point countPerDay(Long countPerDay) {
        this.setCountPerDay(countPerDay);
        return this;
    }

    public void setCountPerDay(Long countPerDay) {
        this.countPerDay = countPerDay;
    }

    public ZonedDateTime getCreationDate() {
        return this.creationDate;
    }

    public Point creationDate(ZonedDateTime creationDate) {
        this.setCreationDate(creationDate);
        return this;
    }

    public void setCreationDate(ZonedDateTime creationDate) {
        this.creationDate = creationDate;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Point)) {
            return false;
        }
        return id != null && id.equals(((Point) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Point{" +
            "id=" + getId() +
            ", key='" + getKey() + "'" +
            ", name='" + getName() + "'" +
            ", keyName='" + getKeyName() + "'" +
            ", description='" + getDescription() + "'" +
            ", keyDescription='" + getKeyDescription() + "'" +
            ", category='" + getCategory() + "'" +
            ", points=" + getPoints() +
            ", countPerDay=" + getCountPerDay() +
            ", creationDate='" + getCreationDate() + "'" +
            "}";
    }
}
