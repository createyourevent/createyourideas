package net.createyourideas.app.repository;

import javax.transaction.Transactional;


import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import net.createyourideas.app.domain.User;

/**
 * Spring Data JPA repository for the {@link User} entity.
 */
@Repository
public interface UserCYERepository extends JpaRepository<User, String> {


    @EntityGraph(attributePaths = "authorities")
    User findOneWithAuthoritiesById(@Param("id") String id);

    @Transactional
    @Modifying(flushAutomatically = true)
    @Query("update User u set u.loggedIn = :loggedIn where u.id = :id")
    void updateLoggedIn(@Param("id") String id, @Param("loggedIn") Boolean loggedIn);

    @Transactional
    @Modifying(flushAutomatically = true)
    @Query("update User u set u.loggedIn = :loggedIn, u.points = :points where u.id = :id")
    void updateLoggedInAndPoints(@Param("id") String id, @Param("loggedIn") Boolean loggedIn, @Param("points") Integer points);

    @Transactional
    @Modifying(flushAutomatically = true)
    @Query("update User u set u.address = :address, u.phone = :phone where u.id = :id")
    void updateAddressAndPhone(@Param("id") String id, @Param("address") String address, @Param("phone") String phone);

    @Transactional
    @Modifying(flushAutomatically = true)
    @Query("update User u set u.address = :address, u.phone = :phone, u.iban = :iban where u.id = :id")
    void updateAddressAndPhoneAndIBan(@Param("id") String id, @Param("address") String address, @Param("phone") String phone, @Param("iban") String iban);

    @Transactional
    @Modifying(flushAutomatically = true)
    @Query("update User u set u.address = :address, u.phone = :phone, u.iban = :iban, u.bankname = :bankname, u.bankaddress = :bankaddress where u.id = :id")
    void updateAddressAndPhoneAndIBanAndBanknameAndBankaddress(@Param("id") String id, @Param("address") String address, @Param("phone") String phone, @Param("iban") String iban, @Param("bankname") String bankname, @Param("bankaddress") String bankaddress);

    @Transactional
    @Modifying(flushAutomatically = true)
    @Query("update User u set u.agb = :agb where u.id = :id")
    void updateAGB(@Param("id") String id, @Param("agb") Boolean agb);
}
