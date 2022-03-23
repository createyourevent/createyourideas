package net.createyourideas.app.service.impl;

import net.createyourideas.app.domain.Employee;
import net.createyourideas.app.repository.EmployeeExtRepository;
import net.createyourideas.app.service.EmployeeExtService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Employee}.
 */
@Service
@Transactional
public class EmployeeExtServiceImpl implements EmployeeExtService {

    private final Logger log = LoggerFactory.getLogger(EmployeeExtServiceImpl.class);

    private final EmployeeExtRepository employeeExtRepository;

    public EmployeeExtServiceImpl(EmployeeExtRepository employeeExtRepository) {
        this.employeeExtRepository = employeeExtRepository;
    }

    @Override
    public Employee findOneByUserId(String userId) {
        return  this.employeeExtRepository.findOneByUserId(userId);
    }


}
