package net.createyourideas.app.repository;

import net.createyourideas.app.domain.Employee;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Employee entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EmployeeExtRepository extends JpaRepository<Employee, Long> {
    Employee findOneByUserId(String userId);
}
