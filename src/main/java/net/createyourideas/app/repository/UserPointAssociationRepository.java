package net.createyourideas.app.repository;

import java.util.List;
import net.createyourideas.app.domain.UserPointAssociation;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the UserPointAssociation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserPointAssociationRepository extends JpaRepository<UserPointAssociation, Long> {
    @Query(
        "select userPointAssociation from UserPointAssociation userPointAssociation where userPointAssociation.users.login = ?#{principal.preferredUsername}"
    )
    List<UserPointAssociation> findByUsersIsCurrentUser();
}
