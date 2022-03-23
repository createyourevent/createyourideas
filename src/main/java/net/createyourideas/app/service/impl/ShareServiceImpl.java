package net.createyourideas.app.service.impl;

import java.util.List;
import java.util.Optional;
import net.createyourideas.app.domain.Share;
import net.createyourideas.app.repository.ShareRepository;
import net.createyourideas.app.service.ShareService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Share}.
 */
@Service
@Transactional
public class ShareServiceImpl implements ShareService {

    private final Logger log = LoggerFactory.getLogger(ShareServiceImpl.class);

    private final ShareRepository shareRepository;

    public ShareServiceImpl(ShareRepository shareRepository) {
        this.shareRepository = shareRepository;
    }

    @Override
    public Share save(Share share) {
        log.debug("Request to save Share : {}", share);
        return shareRepository.save(share);
    }

    @Override
    public Optional<Share> partialUpdate(Share share) {
        log.debug("Request to partially update Share : {}", share);

        return shareRepository
            .findById(share.getId())
            .map(existingShare -> {
                if (share.getValue() != null) {
                    existingShare.setValue(share.getValue());
                }
                if (share.getDate() != null) {
                    existingShare.setDate(share.getDate());
                }

                return existingShare;
            })
            .map(shareRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Share> findAll() {
        log.debug("Request to get all Shares");
        return shareRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Share> findOne(Long id) {
        log.debug("Request to get Share : {}", id);
        return shareRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Share : {}", id);
        shareRepository.deleteById(id);
    }
}
