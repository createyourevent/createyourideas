package net.createyourideas.app.service;

import net.createyourideas.app.domain.User;

public interface UserCYEService {
    void updateLoggedIn(String id, Boolean loggedIn);
    void updateLoggedInAndPoints(String id, Boolean loggedIn, Integer points);
    void updateAddressAndPhone(String id, String address, String phone);
    void updateAddressAndPhoneAndIBan(String id, String address, String phone, String iban);
    void updateAddressAndPhoneAndIBanAndBanknameAndBankaddress(String id, String address, String phone, String iban, String bankname, String bankaddress);
    User findOneWithAuthoritiesByIdQuery(String id);
    void updateAGB(String id, Boolean agb);
}
