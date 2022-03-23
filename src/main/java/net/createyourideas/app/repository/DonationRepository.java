package net.createyourideas.app.repository;

import java.util.List;
import net.createyourideas.app.domain.Donation;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Donation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DonationRepository extends JpaRepository<Donation, Long> {
    @Query("select donation from Donation donation where donation.user.login = ?#{principal.preferredUsername}")
    List<Donation> findByUserIsCurrentUser();
}
