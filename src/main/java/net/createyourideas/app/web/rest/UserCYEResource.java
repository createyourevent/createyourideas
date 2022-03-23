package net.createyourideas.app.web.rest;

import java.util.Optional;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import net.createyourideas.app.domain.User;
import net.createyourideas.app.repository.UserRepository;
import net.createyourideas.app.security.SecurityUtils;
import net.createyourideas.app.service.UserCYEService;
import net.createyourideas.app.service.UserService;
import net.createyourideas.app.service.dto.AdminUserDTO;


@RestController
@RequestMapping("/api")
public class UserCYEResource {

    private UserCYEService userCYEService;

    private UserRepository userRepository;

    public UserCYEResource(UserCYEService userExtService, UserRepository userRepository) {
        this.userCYEService = userExtService;
        this.userRepository = userRepository;
    }

    @GetMapping("/users/{id}/byId")
    public User getUserWithId(@PathVariable String id) {
        return userCYEService.findOneWithAuthoritiesByIdQuery(id);
    }

   @PutMapping("/users/{id}/update/{address}/{phone}")
    public void updateAddressAndPhone(@PathVariable String id, @PathVariable String address,  @PathVariable String phone) {
        userCYEService.updateAddressAndPhone(id, address, phone);
    }

    @PutMapping("/users/{id}/update/{address}/{phone}/{iban}")
    public void updateAddressAndPhoneAndIBan(@PathVariable String id, @PathVariable String address,  @PathVariable String phone,  @PathVariable String iban) {
        userCYEService.updateAddressAndPhoneAndIBan(id, address, phone, iban);
    }

    @PutMapping("/users/{id}/update/{address}/{phone}/{iban}/{bankname}/{bankaddress}")
    public void updateAddressAndPhoneAndIBanAndBanknameAndBankaddress(@PathVariable String id, @PathVariable String address,  @PathVariable String phone,  @PathVariable String iban,  @PathVariable String bankname,  @PathVariable String bankaddress) {
        userCYEService.updateAddressAndPhoneAndIBanAndBanknameAndBankaddress(id, address, phone, iban, bankname, bankaddress);
    }

    @PutMapping("/users/{id}/{loggedIn}")
    public void updateLoggedIn(@PathVariable String id, @PathVariable Boolean loggedIn) {
        userCYEService.updateLoggedIn(id, loggedIn);
    }

    @PutMapping("/users/{id}/{loggedIn}/{points}")
    public void updateLoggedInAndPoints(@PathVariable String id, @PathVariable Boolean loggedIn, @PathVariable Integer points) {
        userCYEService.updateLoggedInAndPoints(id, loggedIn, points);
    }

    @PutMapping("/users/updateAGBTrue/{id}")
    public void updateAGBsetTrue(@PathVariable String id) {
        userCYEService.updateAGB(id, Boolean.TRUE);
    }

    @GetMapping("/users_createyourevent/loggedIn")
    public AdminUserDTO getUser() {
        if(getUserWithAuthorities().isPresent()) {
            User u = getUserWithAuthorities().get();
            AdminUserDTO dto = new AdminUserDTO(u);
            return dto;
        } else {
            return null;
        }
    }

    @Transactional(readOnly = true)
    public Optional<User> getUserWithAuthorities() {
        return SecurityUtils.getCurrentUserLogin().flatMap(userRepository::findOneWithAuthoritiesByLogin);
    }
}
