package net.createyourideas.app.service.impl;

import java.util.List;
import java.util.Optional;
import net.createyourideas.app.domain.Application;
import net.createyourideas.app.repository.ApplicationRepository;
import net.createyourideas.app.service.ApplicationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Application}.
 */
@Service
@Transactional
public class ApplicationServiceImpl implements ApplicationService {

    private final Logger log = LoggerFactory.getLogger(ApplicationServiceImpl.class);

    private final ApplicationRepository applicationRepository;

    public ApplicationServiceImpl(ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    @Override
    public Application save(Application application) {
        log.debug("Request to save Application : {}", application);
        return applicationRepository.save(application);
    }

    @Override
    public Optional<Application> partialUpdate(Application application) {
        log.debug("Request to partially update Application : {}", application);

        return applicationRepository
            .findById(application.getId())
            .map(existingApplication -> {
                if (application.getTitle() != null) {
                    existingApplication.setTitle(application.getTitle());
                }
                if (application.getDescription() != null) {
                    existingApplication.setDescription(application.getDescription());
                }
                if (application.getDate() != null) {
                    existingApplication.setDate(application.getDate());
                }
                if (application.getDesiredHourlyWage() != null) {
                    existingApplication.setDesiredHourlyWage(application.getDesiredHourlyWage());
                }
                if (application.getSeen() != null) {
                    existingApplication.setSeen(application.getSeen());
                }
                if (application.getResponded() != null) {
                    existingApplication.setResponded(application.getResponded());
                }

                return existingApplication;
            })
            .map(applicationRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Application> findAll() {
        log.debug("Request to get all Applications");
        return applicationRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Application> findOne(Long id) {
        log.debug("Request to get Application : {}", id);
        return applicationRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Application : {}", id);
        applicationRepository.deleteById(id);
    }
}
