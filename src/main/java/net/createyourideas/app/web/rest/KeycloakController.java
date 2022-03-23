package net.createyourideas.app.web.rest;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import javax.servlet.http.HttpServletRequest;

import com.mysql.cj.x.protobuf.MysqlxCrud.Update;

import org.keycloak.KeycloakPrincipal;
import org.keycloak.KeycloakSecurityContext;
import org.keycloak.OAuth2Constants;
import org.keycloak.adapters.springsecurity.client.KeycloakRestTemplate;
import org.keycloak.adapters.springsecurity.token.KeycloakAuthenticationToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.client.token.grant.client.ClientCredentialsResourceDetails;
import org.springframework.security.oauth2.server.resource.web.DefaultBearerTokenResolver;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;


@RestController
@RequestMapping("/api")
public class KeycloakController {

    private final Logger log = LoggerFactory.getLogger(KeycloakController.class);

    public KeycloakController() {
    }

    @GetMapping("/keycloak/{userId}")
    public Integer getPointsFromUser(@PathVariable String userId) {

        String url = "https://keycloak.createyourevent.org/auth/realms/jhipster/protocol/openid-connect/token";

        ClientCredentialsResourceDetails resourceDetails = new ClientCredentialsResourceDetails();
        resourceDetails.setGrantType(OAuth2Constants.CLIENT_CREDENTIALS);
        resourceDetails.setAccessTokenUri(url);
        resourceDetails.setClientId("web_app");
        resourceDetails.setClientSecret("9f608490-949a-4d83-95b0-f77c64f374bc");

        String url2 = "https://keycloak.createyourevent.org/auth/admin/realms/jhipster/users/" + userId;

        RestTemplate restTemplate = new OAuth2RestTemplate(resourceDetails);

        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.setContentType(MediaType.APPLICATION_JSON);

        Object vars = ((LinkedHashMap<String,Object>)restTemplate.getForObject(url2, Object.class)).get("attributes");
        Object points = ((LinkedHashMap<String,Object>)vars).get("points");
        ArrayList<String> p = (ArrayList<String>)points;
        return Integer.parseInt(p.get(0));
    }


    @PutMapping("/keycloak/{userId}/{points}")
    public void updatePoints(@PathVariable String userId, @PathVariable String points) {

        String url = "https://keycloak.createyourevent.org/auth/realms/jhipster/protocol/openid-connect/token";

        ClientCredentialsResourceDetails resourceDetails = new ClientCredentialsResourceDetails();
        resourceDetails.setGrantType(OAuth2Constants.CLIENT_CREDENTIALS);
        resourceDetails.setAccessTokenUri(url);
        resourceDetails.setClientId("web_app");
        resourceDetails.setClientSecret("9f608490-949a-4d83-95b0-f77c64f374bc");

        String url2 = "https://keycloak.createyourevent.org/auth/admin/realms/jhipster/users/" + userId;

        RestTemplate restTemplate = new OAuth2RestTemplate(resourceDetails);

        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> n = new HttpEntity<String>("{\"attributes\": {\"points\": \"" + points + "\"}}", responseHeaders);

        restTemplate.put(url2, n);
    }




}
