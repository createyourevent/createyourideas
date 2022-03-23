package net.createyourideas.app.service.impl;

import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.cache.CacheManager;
import org.springframework.transaction.annotation.Transactional;

import net.createyourideas.app.domain.User;
import net.createyourideas.app.repository.UserCYERepository;
import net.createyourideas.app.repository.UserRepository;
import net.createyourideas.app.service.UserCYEService;



@Service
@Transactional
public class UserCYEServiceImpl implements UserCYEService {

    private UserCYERepository userCYERepository;
    private final CacheManager cacheManager;
    private final UserRepository userRepository;

    public UserCYEServiceImpl(UserCYERepository userCYERepository, CacheManager cacheManager, UserRepository userRepository) {
        this.userCYERepository = userCYERepository;
        this.cacheManager = cacheManager;
        this.userRepository = userRepository;
    }



    private void clearUserCaches(User user) {
        Objects.requireNonNull(cacheManager.getCache(UserRepository.USERS_BY_LOGIN_CACHE)).evict(user.getLogin());
        if (user.getEmail() != null) {
            Objects.requireNonNull(cacheManager.getCache(UserRepository.USERS_BY_EMAIL_CACHE)).evict(user.getEmail());
        }
    }

    @Override
    public void updateLoggedIn(String id, Boolean loggedIn) {
       userCYERepository.updateLoggedIn(id, loggedIn);
       if(userRepository.existsById(id)) {
        User user = userRepository.findById(id).get();
        this.clearUserCaches(user);
       }
    }


    @Override
    public void updateLoggedInAndPoints(String id, Boolean loggedIn, Integer points) {
       userCYERepository.updateLoggedInAndPoints(id, loggedIn, points);
       if(userRepository.existsById(id)) {
        User user = userRepository.findById(id).get();
        this.clearUserCaches(user);
       }
    }



    @Override
    public void updateAddressAndPhone(String id, String address, String phone) {
        userCYERepository.updateAddressAndPhone(id, address, phone);
        if(userRepository.existsById(id)) {
            User user = userRepository.findById(id).get();
         this.clearUserCaches(user);
        }
    }

    @Override
    public User findOneWithAuthoritiesByIdQuery(String id) {
        User user = userCYERepository.findOneWithAuthoritiesById(id);
        return user;
    }



    @Override
    public void updateAddressAndPhoneAndIBan(String id, String address, String phone, String iban) {
        userCYERepository.updateAddressAndPhoneAndIBan(id, address, phone, iban);
        if(userRepository.existsById(id)) {
         User user = userRepository.findById(id).get();
         this.clearUserCaches(user);
        }

    }



    @Override
    public void updateAddressAndPhoneAndIBanAndBanknameAndBankaddress(String id, String address, String phone,
            String iban, String bankname, String bankaddress) {
                userCYERepository.updateAddressAndPhoneAndIBanAndBanknameAndBankaddress(id, address, phone, iban, bankname, bankaddress);
                if(userRepository.existsById(id)) {
                 User user = userRepository.findById(id).get();
                 this.clearUserCaches(user);
                }
    }



    @Override
    public void updateAGB(String id, Boolean agb) {
        userCYERepository.updateAGB(id, agb);
        if(userRepository.existsById(id)) {
            User user = userRepository.findById(id).get();
            this.clearUserCaches(user);
        }
    }

}
