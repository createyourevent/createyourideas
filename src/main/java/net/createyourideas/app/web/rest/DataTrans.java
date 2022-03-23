package net.createyourideas.app.web.rest;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
@RequestMapping("/api")
public class DataTrans {

    private final Logger log = LoggerFactory.getLogger(DataTrans.class);


    @GetMapping("/datatrans/{amount}/{type}/{id}")
    public String getTransactionId(@PathVariable Integer amount, @PathVariable  String type, @PathVariable Integer id) {
        log.debug("REST request for TransactionId");

        String successURL = "";
        String errorURL = "";
        String cancelURL = "";
        String refNo = this.getRefNo();

        if(type.equals("idea")) {
            successURL = "https://dev.createyourideas.net/success/idea/" + id + "/" + refNo;
            errorURL = "https://dev.createyourideas.net/error/idea/" + id + "/" + refNo;
            cancelURL = "https://dev.createyourideas.net/cancel/idea/" + id + "/" + refNo;
        }

        String url = "https://api.sandbox.datatrans.com/v1/transactions";
        String[] commands = new String[]{"curl", "--user", "1100032109:PfzwZzluXkvPMlX0", "-H", "Content-Type: application/json", "--data-raw", "{\"redirect\": {\"successUrl\": \"" + successURL + "\", \"cancelUrl\": \"" + cancelURL + "\",\"errorUrl\": \"" + errorURL + "\", \"method\": \"GET\"}, \"autoSettle\": true, \"currency\":\"CHF\",\"refno\": \"" + refNo + "\",\"amount\":" + amount + "}", url};
        String response = "";
        JSONObject json;
        String text = "";
        try {
            String line;
            Process process = Runtime.getRuntime().exec(commands);
            BufferedReader reader = new BufferedReader(new
            InputStreamReader(process.getInputStream()));
            while ((line = reader.readLine()) != null) {
                response += line;
            }
            json = new JSONObject(response);
            text = json.getString("transactionId");
        } catch (IOException e) {
            e.printStackTrace();
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return response;
    }

    @GetMapping("/datatrans/txId/{txId}")
    public String getStatus(@PathVariable String txId) {
        log.debug("REST request for TransactionId-Status");

        String url = "https://api.sandbox.datatrans.com/v1/transactions/" + txId;
        String[] commands = new String[]{"curl", "--user", "1100032109:PfzwZzluXkvPMlX0", "-i", "-X", "GET", url};
        String response = "";
        JSONObject json;
        String text = "";
        try {
            String line;
            Process process = Runtime.getRuntime().exec(commands);
            BufferedReader reader = new BufferedReader(new
            InputStreamReader(process.getInputStream()));
            while ((line = reader.readLine()) != null) {
                response += line;
            }
            text = response.substring(response.indexOf("{"), response.length());
        } catch (IOException e) {
            e.printStackTrace();
        }

        return text;
    }


    private String getRefNo() {
        String ref = "";
        String possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (int i = 0; i < 20; i++) {
          ref += possible.charAt((int)(Math.floor(Math.random() * possible.length())));
        }

     return ref;
    }


}
