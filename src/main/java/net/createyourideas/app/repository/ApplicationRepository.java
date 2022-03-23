package net.createyourideas.app.repository;

import java.util.List;
import net.createyourideas.app.domain.Application;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Application entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    @Query("select application from Application application where application.user.login = ?#{principal.preferredUsername}")
    List<Application> findByUserIsCurrentUser();
}
