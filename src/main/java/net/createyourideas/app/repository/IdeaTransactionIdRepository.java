package net.createyourideas.app.repository;

import net.createyourideas.app.domain.IdeaTransactionId;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the IdeaTransactionId entity.
 */
@SuppressWarnings("unused")
@Repository
public interface IdeaTransactionIdRepository extends JpaRepository<IdeaTransactionId, Long> {}
