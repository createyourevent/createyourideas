package net.createyourideas.app.service;

import java.util.List;
import java.util.Optional;
import net.createyourideas.app.domain.Employee;

/**
 * Service Interface for managing {@link Employee}.
 */
public interface EmployeeExtService {
    Employee findOneByUserId(String userId);
}
