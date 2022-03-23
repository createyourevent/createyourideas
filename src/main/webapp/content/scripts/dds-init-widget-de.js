/*jslint browser: true, sloppy: true, plusplus: true, nomen: true, todo: true*/
/*globals $, jQuery, console, ddsWidgetConfig */

if (!window.console) {
    var noop = function () {},
        console = {
            log: noop,
            info: noop,
            warn: noop,
            error: noop
        };
}
(function (prodOptions, devOptions) {

    var tempJQuery,
        scriptTag,
        devMode = (location.hash.indexOf("ddsdev") !== -1),
        noCache = (location.hash.indexOf("rnw-no-cache") !== -1),
        options = (!devMode || !devOptions)? prodOptions : devOptions,
        scripts = options.scripts,
        css = options.css,
        baseUrl = options.baseUrl,
        cdnUrl = (options.cdnBaseUrl && !noCache) ? options.cdnBaseUrl : null,
        preferredUrl = (cdnUrl) ? cdnUrl : baseUrl,
        basePath= options.basePath;

    initPreloader();

    // load jquery and then everything else
    loadjQuery(function () {
        init();
    });

    function initPreloader () {
        // target is available
        if (document.getElementsByClassName("dds-widget-container").length > 0) {
            showPreloader();
        } else {
            // wait for target / wait for dom ready
            if (document.readyState === "complete" ||
                (document.readyState !== "loading" && !document.documentElement.doScroll)) {
                showPreloader();
            } else {
                document.addEventListener("DOMContentLoaded", showPreloader);
            }
        }
    }

    function showPreloader () {
        var divNode,
            widgetContainers,
            widgetContainerChildNodes,
            textNodes,
            index,
            widgetIndex,
            hasNoContent;

        if (document.getElementsByClassName("dds-widget-container").length > 0) {
            textNodes = [];
            hasNoContent = true;
            widgetContainers = document.getElementsByClassName("dds-widget-container");
            for(widgetIndex in widgetContainers) {
                //In Safari 9.1.x length is a enumerable property. Therefore we have to exclude it explicitly
                if(widgetContainers.hasOwnProperty(widgetIndex) && widgetIndex != 'length') {
                    divNode = document.createElement("div");
                    divNode.setAttribute("rnwid", "rnw-preloader");
                    widgetContainerChildNodes = widgetContainers[widgetIndex].childNodes;
                    for (index in widgetContainerChildNodes) {
                        // Node is an element
                        if (widgetContainerChildNodes.hasOwnProperty(index) && widgetContainerChildNodes[index].nodeType === 1) {
                            widgetContainerChildNodes[index].setAttribute("rnwid", "rnw-preloader");
                            hasNoContent = false;
                            // Node is a text node
                        } else if (widgetContainerChildNodes.hasOwnProperty(index) && widgetContainerChildNodes[index].nodeType === 3 &&
                            widgetContainerChildNodes[index].nodeValue.trim() != "") {
                            //Keep text node reference to wrap it later into a div element
                            textNodes.push(widgetContainerChildNodes[index]);
                            hasNoContent = false;
                        }
                    }
                    for (index in textNodes) {
                        if (textNodes.hasOwnProperty(index)) {
                            divNode.appendChild(textNodes[index]);
                        }
                    }
                    if (hasNoContent) {
                        // Create a text node
                        divNode.appendChild(document.createTextNode('Loading...'));
                    }
                    widgetContainers[widgetIndex].appendChild(divNode);
                }
            }
        }
    }

    function loadjQuery(cb) {
        cb = cb || noop

        //jquery 1.9.1 patched because of http://bugs.jquery.com/ticket/13936.
        if (window.jQuery === undefined || window.jQuery.fn.jquery != '3.2.1') {
            scriptTag = document.createElement('script');
            scriptTag.setAttribute('type', 'text/javascript');
            scriptTag.setAttribute('src',
                preferredUrl + '/widgets/ela/_default/js/jquery-3.2.1.min.js');
            if (scriptTag.readyState) {
                scriptTag.onreadystatechange = function () { // For old versions of IE
                    if (this.readyState === 'complete' || this.readyState === 'loaded') {
                        jQueryFix = window.jQuery.noConflict(true);
                        cb()
                    }
                };
            } else { // Other browsers
                scriptTag.onload = function() {
                    jQueryFix = window.jQuery.noConflict(true);
                    cb()
                }
            }
            //tempJQuery = window.jQuery;

            // Try to find the head, otherwise default to the documentElement
            (document.getElementsByTagName('head')[0]
            || document.documentElement).appendChild(scriptTag);
        } else {
            // The jQuery version on the window is the one we want to use
            /*jQuery = window.jQuery;
             tempJQuery = jQuery;*/
            jQueryFix = window.jQuery;
            cb();
        }
    }

    function createDdsWidgetConfig() {
        if (typeof ddsWidgetConfig !== 'object') {
            ddsWidgetConfig = {};
        }
        if (typeof rnwWidget !== 'object') {
            rnwWidget = {};
        }
        if (typeof rnwWidget.widgets !== 'object') {
            rnwWidget.widgets = {};
        }
        if(typeof rnwWidget.widgets['lema'] !== 'object') {
            rnwWidget.widgets['lema'] = {};
        }
        if(typeof rnwWidget.widgets['lema']['configurations'] !== 'object') {
            rnwWidget.widgets['lema']['configurations'] = {};
        }
        if(typeof rnwWidget.widgets['lema']['configurations']['mmmm-426af'] !== 'object') {
            rnwWidget.widgets['lema']['configurations']['mmmm-426af'] = {};
        }

        // Set this variable so that it can be used as an IIFE argument in widget scripts.
        // This way, the widget code doesn't need to 'know' what name it has been given.
        rnwWidget.widgets.currentName = 'lema';
    }

    function addCssTag(cssUrl) {
        var cssLink = jQueryFix('<link>', {
                rel: 'stylesheet',
                type: 'text/css',
                href: cssUrl
            });
        jQueryFix('head').append(cssLink);
    }

    function init() {
        jQueryFix(document).ready(function () {

            jQueryFix(window).on("rnw-widget-loaded", function(event) {
                jQueryFix(".dds-widget-container [rnwid=rnw-preloader]").remove();
            });

            createDdsWidgetConfig();

            loadJavascript(scripts);
        });
    }

    function scriptLoaderHandler() {
        loadJavascript();
    }

    function addParametersToDdsWidgetConfig() {
        var epikOptions = {};epikOptions["apiendpoint"] = "https://api.raisenow.com/epayment/api/step/pay/merchant/mmmm-426af";epikOptions["secure_cookie"] = "false";epikOptions["test_mode"] = "false";epikOptions["method"] = "POST";epikOptions["mobile_mode"] = "false";epikOptions["enable_jquery"] = "true";epikOptions["iframe_container"] = "iframe_wrapper";epikOptions["trigger_event"] = "false";epikOptions["auto_submit"] = "false";epikOptions["currency"] = "chf";epikOptions["language"] = "de";epikOptions["delete_data_after_submit"] = "true";epikOptions["popup"] = "false";var baseResponseUrl=window.location.protocol + "//" + window.location.host;epikOptions.success_url="https://widget.raisenow.com/widgets/lema/rnw-widget.html";epikOptions.error_url="https://widget.raisenow.com/widgets/lema/rnw-widget.html";epikOptions.cancel_url="https://widget.raisenow.com/widgets/lema/rnw-widget.html";epikOptions.iframe_loading_page="https://widget.raisenow.com/widgets/lema/rnw-widget.html?ddssubmit=true";epikOptions.widget_uuid="mmmm-426af";epikOptions.pollstatus_url="https://widget.raisenow.com/widgets/lema/_default/pollstatus.php";epikOptions.crmc_url="https://widget.raisenow.com";rnwWidget.widgets["lema"]["configurations"]["mmmm-426af"].epikOptions = epikOptions;rnwWidget.widgets["lema"]["configurations"]["mmmm-426af"].baseResponseUrl = baseResponseUrl;rnwWidget.widgets["lema"]["configurations"]["mmmm-426af"].translations = {"common":{"placeholders":{"year":"JJJJ","month":"MM","day":"DD"},"confirmbutton":"Weiter","donationbutton":"Jetzt spenden","editbutton":"\u00c4ndern","monthly":"monatlich","quarterly":"viertelj\u00e4hrlich","semestral":"halbj\u00e4hrlich","yearly":"j\u00e4hrlich","single":"einmalig","recurring":"und spende","currency":"Fr.","currency_iso":"CHF","currency_long":"Franken","pleasechoose":"Bitte w\u00e4hlen..","dataloading":"Daten werden \u00fcbermittelt ...","yes":"Ja","no":"Nein","ok":"OK","cancel":"Abbrechen","payment_methods":{"es":"Einzahlungsschein","ezs":"Einzahlungsschein","sms":"SMS","pfc":"PostFinance Card","pef":"PostFinance E-Finance","vis":"VISA","eca":"Master Card","amx":"American Express","din":"Diners Club \/ Discover Card","dd":"LSV \/ DD","pex":"PayPal","pp":"PayPal","eps":"eps Online-\u00dcberweisung","elv":"Elektronisches Lastschriftverfahren","twi":"TWINT","mpw":"Masterpass"}},"validation":{"class_rules":{"customamount":{"messages":{"required":"Bitte geben Sie einen Betrag an","digits":"Bitte geben Sie einen Betrag an","rnwmin":"Bitte einen Betrag \u00fcber CHF {0} eingeben"}},"cardno":{"messages":{"required":"Bitte geben Sie eine Kreditkartennummer an","creditcard":"Bitte geben Sie eine g\u00fcltige Kreditkartennummer ein","rnwcreditcard":"Bitte geben Sie eine unterst\u00fctzte Kreditkartennummer ein"}},"expm":{"messages":{"required":"Bitte geben Sie einen Ablaufmonat an","digits":"Bitte geben Sie den Ablaufmonat in Zahlen an","range":"Bitte geben Sie eine Zahl zwischen 1 und 12 ein"}},"expy":{"messages":{"required":"Bitte geben Sie ein Ablaufjahr an","digits":"Bitte geben Sie das Ablaufjahr mit vier Zahlen an","range":"Das eingegebene Ablaufjahr liegt ausserhalb des g\u00fcltigen Bereichs"}},"cvv":{"messages":{"required":"Bitte geben Sie den CVV-Code Ihrer Kreditkarte ein","digits":"Bitte geben Sie den Sicherheitscode in Zahlen an"}},"msisdn":{"messages":{"required":"Bitte geben Sie Ihre Schweizer Mobile-Nummer an","msisdn":"Bitte geben Sie eine g\u00fcltige Schweizer Mobile-Nummer an"}},"iban":{"messages":{"required":"Bitte geben Sie Ihre Schweizer IBAN-Nummer an","iban":"Bitte geben Sie eine g\u00fcltige IBAN-Nummer ein","ibanCountry":"Bitte geben Sie eine Schweizer IBAN-Nummer an. Ausl\u00e4ndische Konten k\u00f6nnen nicht belastet werden."}},"bank_name":{"messages":{"required":"Bitte geben Sie Ihre Bank- oder Postverbindung ein"}},"stored_customer_salutation":{"messages":{"required":"Bitte treffen Sie eine Auswahl"}},"stored_customer_firstname":{"messages":{"required":"Bitte geben Sie einen Vornamen an"}},"stored_customer_lastname":{"messages":{"required":"Bitte geben Sie einen Nachnamen an"}},"stored_customer_email":{"messages":{"required":"Bitte geben Sie Ihre E-Mail-Adresse an","minlength":"Geben Sie bitte eine korrekte E-Mail-Adresse an","email":"Geben Sie bitte eine korrekte E-Mail-Adresse an"}},"customer_birthdate_day":{"messages":{"required":"Bitte geben Sie Ihren Geburtstag ein","digits":"Bitte geben Sie das Datum in Zahlen an","range":"Bitte geben Sie eine Zahl zwischen 1 und 31 ein"}},"customer_birthdate_month":{"messages":{"required":"Bitte geben Sie Ihren Geburtsmonat ein","digits":"Bitte geben Sie das Datum in Zahlen an","range":"Bitte geben Sie eine Zahl zwischen 1 und 12 ein"}},"customer_birthdate_year":{"messages":{"required":"Bitte geben Sie Ihr Geburtsjahr ein","digits":"Bitte geben Sie das Jahr mit vier Zahlen an","range":"Bitte geben Sie Ihr richtiges Geburtsjahr ein"}},"stored_customer_street":{"messages":{"required":"Bitte geben Sie eine Strasse an"}},"stored_customer_zip_code":{"messages":{"required":"Bitte geben Sie eine Postleitzahl an","digits":"Bitte geben Sie hier nur Zahlen ein","minlength":"Die Postleitzahl besteht aus mindestens 4 Ziffern"}},"stored_customer_city":{"messages":{"required":"Bitte geben Sie einen Ort an"}},"stored_recipient_salutation":{"messages":{"required":"Bitte treffen Sie eine Auswahl"}},"stored_recipient_firstname":{"messages":{"required":"Bitte geben Sie einen Vornamen an"}},"stored_recipient_lastname":{"messages":{"required":"Bitte geben Sie einen Nachnamen an"}},"recipient_birthdate_day":{"messages":{"required":"Bitte geben Sie einen Geburtstag ein","digits":"Bitte geben Sie das Datum in Zahlen an","range":"Bitte geben Sie eine Zahl zwischen 1 und 31 ein"}},"recipient_birthdate_month":{"messages":{"required":"Bitte geben Sie einen Geburtsmonat ein","digits":"Bitte geben Sie das Datum in Zahlen an","range":"Bitte geben Sie eine Zahl zwischen 1 und 12 ein"}},"recipient_birthdate_year":{"messages":{"required":"Bitte geben Sie ein Geburtsjahr ein","digits":"Bitte geben Sie das Jahr mit vier Zahlen an","range":"Bitte geben Sie Ihr richtiges Geburtsjahr ein"}},"stored_recipient_street":{"messages":{"required":"Bitte geben Sie eine Strasse an"}},"stored_recipient_zip_code":{"messages":{"required":"Bitte geben Sie eine Postleitzahl an","minlength":"Die Postleitzahl besteht aus mindestens 4 Ziffern","digits":"Bitte geben Sie hier nur Zahlen ein"}},"stored_recipient_city":{"messages":{"required":"Bitte geben Sie einen Ort an"}},"member_salutation":{"messages":{"required":"Bitte treffen Sie eine Auswahl"}},"member_firstname":{"messages":{"required":"Bitte geben Sie einen Vornamen an"}},"member_lastname":{"messages":{"required":"Bitte geben Sie einen Nachnamen an"}},"member_birthdate_day":{"messages":{"required":"Bitte geben Sie einen Geburtstag ein","digits":"Bitte geben Sie das Datum in Zahlen an","range":"Bitte geben Sie eine Zahl zwischen 1 und 31 ein"}},"member_birthdate_month":{"messages":{"required":"Bitte geben Sie einen Geburtsmonat ein","digits":"Bitte geben Sie das Datum in Zahlen an","range":"Bitte geben Sie eine Zahl zwischen 1 und 12 ein"}},"member_birthdate_year":{"messages":{"required":"Bitte geben Sie ein Geburtsjahr ein","digits":"Bitte geben Sie das Jahr mit vier Zahlen an","range":"Bitte geben Sie Ihr richtiges Geburtsjahr ein"}}}},"field_values":{"stored_customer_email_permission":"true","stored_customer_donation_receipt":"true","stored_customer_salutation_mr":"mr","stored_customer_salutation_ms":"ms","stored_customer_salutation_fam":"fam","stored_recipient_salutation_mr":"mr","stored_recipient_salutation_ms":"ms","member_salutation_mr":"mr","member_salutation_ms":"ms"},"bank_names":{"bc_1":"SNB","bc_2":"UBS AG","bc_4":"Credit Suisse Group AG","bc_5":"Neue Aargauer Bank","bc_6":"RBA Regionalbanken","bc_7":"Kantonalbank","bc_8":"Raiffeisenbank","bc_9":"PostFinance AG"},"page_edit_subscription":{"title":"Ihre aktuellen Angaben","name":"Vor-\/Nachname:","email":"E-Mail:","payment_method":"Zahlungsmittel:","donate":"Spendenrhythmus:","donation_amount":"Spendenbetrag:","donation_target":"Spendenzweck:","status":"Status:","status_active_text":"aktiv","status_inactive_text":"inaktiv","aside_title":"","aside_text":"","aside_image":"","intervals":{"interval_default":"regelm\u00e4ssig","interval_01_00_*_*_1":"w\u00f6chentlich","interval_01_00_L_*_*":"monatlich","interval_01_00_L_*\/3_*":"viertelj\u00e4hrlich","interval_01_00_L_*\/6_*":"halbj\u00e4hrlich","interval_01_00_L_12_*":"j\u00e4hrlich","interval_01_00_1_*_*":"monatlich","interval_01_00_1_*\/3_*":"viertelj\u00e4hrlich","interval_01_00_1_*\/6_*":"halbj\u00e4hrlich","interval_01_00_1_12_*":"j\u00e4hrlich"},"back_to_overview_link_text":"Zur\u00fcck zur \u00dcbersicht","charged":"belastet","contact_information":"Kontaktangaben","subscription_information":"Abo","expiry_date":"G\u00fcltig bis:","renew":{"success_title":"Herzlichen Dank!","success_subtitle":"Ihr Abo wurde erfolgreich erneuert","success_text":"Herzlichen Dank f\u00fcr die Erneuerung Ihres Abos.","cancel_text":"Wollen Sie Ihre","cancel_link_text":"Abo beenden","success_link_text":"Link zum neuen Abo","update_button_text":"Neue Kreditkarte hinterlegen","submit_button_text":"Kreditkarte validieren","change_title":"Angaben bearbeiten"}},"page_error_subscription":{"title":"Fehler bei der Verarbeitung Ihres Abos","sub_title":"Abo nicht gefunden","content":{"intro_html":"<span>Ihr Zahlungsabonnement kann nicht gefunden werden.<\/span>","back_button":"Zur\u00fcck zum Spendenformular"}},"page_cancel_subscription":{"title":"Zahlungsabonnement stornieren","content":{"intro_html":"<span>Klicken sie auf den untenstehenden Link um ihr Zahlungsabonnement zu stornieren<\/span>","cancel_button":"Stornieren","back_to_overview_link_text":"Zur\u00fcck zur \u00dcbersicht"}},"page_subscription_renew_success":{"title":"Herzlichen Dank f\u00fcr die Erneuerung des Abos","content_html":"<span>Danke<\/span>","reload_to_overview_link_text":"Zur\u00fcck zur \u00dcbersicht"},"page_form":{"donate_button_label":"Spende sicher \u00fcbermitteln","data_protection":{"text_html":"Sicher spenden mit <a href=\"https:\/\/raisenow.com\/\"target=\"_blank\">RaiseNow.<\/a>","link_text":"Datenschutzbestimmungen"}},"subscription":{"intervals":{"interval_default":"regelm\u00e4ssig","interval_*_*_1":"w\u00f6chentlich","interval_L_*_*":"monatlich","interval_L_*\/3_*":"viertelj\u00e4hrlich","interval_L_*\/6_*":"halbj\u00e4hrlich","interval_L_12_*":"j\u00e4hrlich","interval_1_*_*":"monatlich","interval_1_*\/3_*":"viertelj\u00e4hrlich","interval_1_*\/6_*":"halbj\u00e4hrlich","interval_1_12_*":"j\u00e4hrlich"}},"payment":{"success":{"title":"Herzlichen Dank f\u00fcr Ihre Spende","button":"Neue Spende","content_html":"Ihr Spendenbetrag: CHF <span class=\"lema-success-amount\"><\/span>"},"success_ES":{"title":"Herzlichen Dank f\u00fcr Ihre Spende","button":"Neue Spende","content_html":"<span>Link zu Ihrem pers\u00f6nlichen Einzahlungsschein:<\/span> <a href=\"#\" target=\"_blank\" class=\"lema-success-pdflink\">Hier Einzahlungsschein herunterladen<\/a>"},"success_ES_true":{"title":"Herzlichen Dank f\u00fcr Ihre Spende","button":"Neue Spende","content_html":"Wir werden Ihnen die gew\u00fcnschten Einzahlungsscheine so rasch als m\u00f6glich zuschicken."},"success_DD":{"title":"Herzlichen Dank f\u00fcr Ihre Spende","button":"Neue Spende","content_html":"<span>Link zu Ihrem pers\u00f6nlichen LSV Formular:<\/span> <a class=\"lema-success-pdflink\" target=\"_blank\"  href=\"#\">Hier Formular herunterladen<\/a>"}},"step_donation_target":{"title":"Spendenzweck","purposes":[{"id":"zweck1","title":"Zweck 1","text":"","campaign_id":"1234","campaign_subid":"1234","image":""},{"id":"zweck2","title":"Zweck 2","text":"","campaign_id":"1234","campaign_subid":"1234","image":""}]},"step_amount":{"title":"Betrag","labels":{"one_time":"Einmalig"},"intervals":{"default":"regelm\u00e4ssig","weekly":"w\u00f6chentlich","monthly":"monatlich","quarterly":"viertelj\u00e4hrlich","semestral":"halbj\u00e4hrlich","yearly":"j\u00e4hrlich"},"recurring_intervals":{"default":"regelm\u00e4ssig","weekly":"w\u00f6chentlich","monthly":"monatlich","quarterly":"viertelj\u00e4hrlich","semestral":"halbj\u00e4hrlich","yearly":"j\u00e4hrlich"},"onetime_amounts":[{"text":"5","value":"500"},{"text":"10","value":"1000"},{"text":"20","value":"2000"},{"text":"120","value":"12000"}],"recurring_amounts":[{"text":"15","value":"1500"},{"text":"20","value":"2000"},{"text":"50","value":"5000"},{"text":"120","value":"12000"}]},"step_payment_method":{"title":"Zahlungsart","sub_title":"Zahlungsart ausw\u00e4hlen","cc":{"tab_title":"Kreditkarte","labels":{"expiry":"G\u00fcltig bis:","cvv":"CVV:","cardno":"Kartennummer","expm":"MM","expy":"YY"},"cvv_popup":[{"text":"Dies sind die letzten 3 bzw. 4 Ziffern im Unterschriftsfeld auf der R\u00fcckseite Ihrer Karte."}],"intro_text":"","information_link":"Hinweise zur Spende mit Kreditkarte","information_popup":[{"html":"<strong>Sicherheit:<\/strong><br\/>Alle Informationen, die f\u00fcr die Spende mit Kreditkarte ausgetauscht werden, sind SSL-verschl\u00fcsselt. Diese Daten k\u00f6nnen weder ermittelt, abgefangen, noch von Dritten verwendet werden. Sie werden auch nicht in unseren Datensystemen abgespeichert. <br\/><br\/><strong>Hinweis:<\/strong><br\/> Die Spende wird vom Verein FairGive treuh\u00e4nderisch entgegengenommen und direkt an MMMM - Heartfull Mind weitergeleitet."},{"images":["_default\/img\/visa_verified.png","_default\/img\/mastercard_secure.png"]}]},"pf":{"tab_title":"PostFinance","icons":["pfc","pef"],"labels":{"pfc":"PostFinance Card","pef":"PostFinance E-Finance"},"intro_text":"","information_link":"Hinweis zur Spende via PostFinance","information_popup":[{"html":"Wenn Sie dieses Formular ausgef\u00fcllt und abgesendet haben, werden Sie direkt zu PostFinance weitergeleitet, um Ihre Spende abzuschliessen. <br\/><br\/><strong>Hinweis:<\/strong><br\/> Die Spende wird vom Verein FairGive treuh\u00e4nderisch entgegengenommen und direkt an MMMM - Heartfull Mind weitergeleitet."},{"images":""}]},"sms":{"tab_title":"SMS","labels":{"msisdn":"Bitte Handynummer eingeben"},"intro_text":"","information_link":"Hinweis zur SMS-Spende","information_popup":[{"html":"Ihre Spende wird \u00fcber Ihre Handy-Rechnung beglichen oder von Ihrem Postfinance-Konto abgebucht. Neben der effektiven Spende fallen f\u00fcr Sie keine zus\u00e4tzlichen Geb\u00fchren an. Ihr Handy-Provider und PostFinance garantieren die sichere \u00dcbermittlung Ihrer SMS."},{"images":""}]},"es":{"tab_title":"Einzahlungsschein","labels":{"download":"Einzahlungsschein als PDF zum selber Herunterladen","order":"Ausgedruckten Einzahlungsschein nach Hause schicken lassen"},"intro_text":"","information_link":"Hinweis zur Spende mit Einzahlungsschein","information_popup":[{"html":"<strong>Welcher Einzahlungsschein?<\/strong><br\/>Der Einzahlungsschein als PDF zum selber Herunterladen ist ideal, wenn Sie \u00fcber E-Banking spenden m\u00f6chten. Falls Sie den Einzahlungsschein nach Hause schicken lassen, beachten Sie bitte, dass f\u00fcr den Versand und die Einzahlung am Postschalter zus\u00e4tzliche Kosten f\u00fcr die Organisation anfallen."},{"images":""}]},"ezs":{"tab_title":"Einzahlungsschein","labels":{"download":"Einzahlungsschein als PDF (Download)","order":"Einzahlungsschein per Post zuschicken lassen"},"intro_text":"","information_link":"Hinweis zur Spende mit Einzahlungsschein","information_popup":[{"html":"<strong>Welcher Einzahlungsschein?<\/strong><br\/>Der Einzahlungsschein als PDF (Download) ist ideal, wenn Sie \u00fcber E-Banking spenden m\u00f6chten. Gerne senden wir Ihnen aber auch einen Einzahlungsschein zu. Bitte beachten Sie, dass durch den Versand von Einzahlungsscheinen und die Spende am Postschalter f\u00fcr uns zus\u00e4tzliche Kosten anfallen."},{"images":""}]},"dd":{"tab_title":"LSV \/ DD","labels":{"iban":"IBAN","bank_name":"Name der Bank","download":"LSV-Formular als PDF zum selber Herunterladen","order":"Ausgedrucktes LSV-Formular nach Hause schicken lassen"},"intro_text":"","information_link":"Hinweise zur Spende via LSV \/ DD","information_popup":[{"html":"Mit einer regelm\u00e4ssigen Spende \u00fcber ein Lastschriftverfahren (LSV) \/ Direct Debit (DD) sorgen Sie effizient und kosteng\u00fcnstig daf\u00fcr, dass Ihre Hilfe ankommt."},{"images":""}]},"eps":{"tab_title":"eps","icons":["eps"],"labels":"","intro_text":"","information_link":"Hinweis zu eps Online-\u00dcberweisung","information_popup":[{"html":"Die eps Online-\u00dcberweisung ist das einfache und sichere Online-Bezahlverfahren der \u00f6sterreichischen Banken f\u00fcr Eink\u00e4ufe im Internet \u00fcber das vertraute Online-Banking!"},{"images":""}]},"pex":{"tab_title":"PayPal","icons":["pex"],"labels":"","intro_text":"Wenn Sie dieses Formular ausgef\u00fcllt und abgesendet haben, werden Sie direkt zu PayPal weitergeleitet, um Ihre Spende zu best\u00e4tigen."},"pp":{"tab_title":"PayPal","icons":["pp"],"labels":"","intro_text":"Wenn Sie dieses Formular ausgef\u00fcllt und abgesendet haben, werden Sie direkt zu PayPal weitergeleitet, um Ihre Spende zu best\u00e4tigen."},"dib":{"tab_title":"SOFORT \u00dcberweisung","icons":["dib"],"labels":"","intro_text":"","information_link":"Hinweis zur SOFORT \u00dcberweisung Zahlung","information_popup":[{"html":"Wenn Sie dieses Formular ausgef\u00fcllt und abgesendet haben, werden Sie direkt zu SOFORT \u00dcberweisung weitergeleitet, um Ihre Spende zu best\u00e4tigen."},{"images":["_default\/img\/sofortueberweisung_de.png"]}]},"elv":{"tab_title":"Elektronisches Lastschriftverfahren","icons":["elv"],"labels":{"iban":"IBAN"},"intro_text":"","information_link":"Hinweis zu elektronisches Lastschriftverfahren","information_popup":[{"html":"<strong>Elektronisches Lastschriftverfahren<\/strong><br\/>..."},{"images":""}]},"twi":{"tab_title":"TWINT","icons":["twi"],"labels":"","intro_text":"F\u00fcr die Zahlung mit TWINT ben\u00f6tigen Sie das vorinstallierte iOS- oder Android-App von TWINT auf Ihrem Smartphone. Mittels Scan des QR-Codes oder manueller Eingabe der 5stelligen Transaktionsnummer in der TWINT-App wird die Zahlung ausgel\u00f6st.","information_link":"Hinweis zur Spende via TWINT","information_popup":[{"html":"Die Spende wird vom Verein FairGive treuh\u00e4nderisch entgegengenommen und direkt an MMMM - Heartfull Mind weitergeleitet."},{"images":""}]},"mpw":{"tab_title":"Masterpass","icons":["mpw"],"intro_text":"Bei einer Spende mit dem Masterpass Wallet werden Sie direkt zu Masterpass weitergeleitet. Bitte folgen Sie hier den Anweisungen.","information_link":"Hinweis zur Spende via Masterpass","information_popup":[{"html":"Die Spende wird vom Verein FairGive treuh\u00e4nderisch entgegengenommen und direkt an MMMM - Heartfull Mind weitergeleitet."},{"images":""}]}},"step_customer_address_compact_mode":{"title":"Ihre Daten","labels":{"contact_information":"Ihre Personalien","email":"Ihre Email-Adresse","address":"Adresse","birthdate":"Geburtsdatum","link_text_edit":"Meine Personalien oder Adresse \u00e4ndern","link_text_notme":"Das bin ich nicht"}},"step_customer_identity":{"title":"Ihre Personalien","labels":{"salutation_ms":"Frau","salutation_mr":"Herr","salutation_fam":"Familie","firstname":"Vorname","lastname":"Nachname","birthdate":"Geburtstag:","email":"E-Mail","email_permission":"Ich m\u00f6chte \u00fcber weitere Projekte informiert werden","message":"Bemerkungen","donation_receipt":"Ja, ich m\u00f6chte eine Spendenbescheinigung f\u00fcr die Steuererkl\u00e4rung"}},"step_customer_address":{"title":"Ihre Adresse","labels":{"company":"Firma (optional)","street":"Strasse","street_number":"Nr.","street2":"Strasse Zusatz","pobox":"Postfach","zip_code":"PLZ","city":"Ort"}},"step_recipient_information":{"title":"Beschenktes Kind","labels":{"salutation_ms":"Frau","salutation_mr":"Herr","firstname":"Vorname","lastname":"Nachname","birthdate":"Geburtstag:","street":"Strasse","street_number":"Nr.","street2":"Strasse Zusatz","pobox":"Postfach","zip_code":"PLZ","city":"Ort"}},"step_members":{"title":"Familienmitglieder","labels":{"salutation_ms":"Frau \/ M\u00e4dchen","salutation_mr":"Herr \/ Junge","firstname":"Vorname","lastname":"Nachname","birthdate":"Geburtstag:"},"delete_dialog_text":"Wollen Sie diesen Eintrag wirklich l\u00f6schen?","add_button":"Familienmitglied hinzuf\u00fcgen"},"overlay_data_protection":{"title":"Datenschutz","content":"Die \u00dcbermittlung der Daten erfolgt verschl\u00fcsselt. MMMM - Heartfull Mind speichert selbst keine Kartendaten, Ihre Zahlungsdaten laufen direkt \u00fcber RaiseNow, einem von der Kreditkartenindustrie (PCI DSS) zertifizierten Partner. Unsere Dienstleister d\u00fcrfen die Informationen ausschliesslich zur Erf\u00fcllung ihrer Aufgaben nutzen und sind verpflichtet, die schweizerischen Datenschutzbestimmungen einzuhalten.<br\/>Sie k\u00f6nnen Ihre <strong>Spende von Ihrem steuerbaren Einkommen abziehen<\/strong>. Spender erhalten per E-Mail eine Spendenbest\u00e4tigung zu Handen der Steuerbeh\u00f6rden. Die Spenden gehen an MMMM - Heartfull Mind."},"overlay_loading":{"content":{"intro_text":"Zahlungsprozess wird initiiert...","ajax_loader":"_default\/img\/ajax-loader.gif"}},"overlay_payment_cancel":{"title":"Sie haben Ihre Aktion abgebrochen.","content":{"text":"Leider konnte Ihre Spende nicht verarbeitet werden. Sie haben die Zahlung abgebrochen."}},"overlay_payment_error":{"title":"Es ist ein Fehler aufgetreten.","content":{"text":"Beim Laden Ihrer Spendendaten ist ein Fehler aufgetreten. Sie erreichen unsere Mitarbeiterinnen und Mitarbeiter telefonisch unter der Nummer ceo@heartfull-mind.org  oder per E-Mail unter +41 79 296 63 45 .","show_details":"Details anzeigen"}},"overlay_sms_poll":{"title":"Danke, nur noch einen Schritt","content":{"time_remaining":"Verbleibende Zeit f\u00fcr die Best\u00e4tigung Ihrer Spende:","text":"Wir haben Ihre Spenden-Nachricht erhalten. In K\u00fcrze erhalten Sie ein SMS an die angegebene Handy-Nummer. Bitte best\u00e4tigen Sie dann Ihre Spende sofort per SMS (um Missbr\u00e4uche zu vermeiden). Nur dann spenden Sie f\u00fcr unsere wichtigsten Projekte. Wir erhalten Ihre Spende via Ihre Handy-Rechnung."},"footer":{"retry":"Keine SMS erhalten?","cancel":"Spende abbrechen"}},"overlay_subscription_error":{"title":"Fehler bei der Verarbeitung Ihres Abos","content":{"text":"Ihr Abo konnte nicht gefunden werden."}},"overlay_subscription_cancel_error":{"title":"Fehler bei der Verarbeitung Ihres Abos","content":{"text":"Ihr Abo konnte nicht gek\u00fcndigt werden."}},"overlay_subscription_cancel_confirmation":{"title":"Abo gek\u00fcndigt","content":{"text":"Sie haben ihr Abo erfolgreich gek\u00fcndigt."}},"email":{"general":{"salutation":{"mr":"Herr","ms":"Frau"},"salutation_long":{"mr":"Sehr geehrter Herr","ms":"Sehr geehrte Frau","fam":"Sehr geehrte Familie","unknown":"Lieber\/Liebe"},"boolean":{"yes":"Ja","no":"Nein"},"parameters":{"feedback_phone":"ceo@heartfull-mind.org ","feedback_email":"+41 79 296 63 45 "},"intervals":{"default":"regelm\u00e4ssig","weekly":"w\u00f6chentlich","monthly":"monatlich","quarterly":"viertelj\u00e4hrlich","semestral":"halbj\u00e4hrlich","yearly":"j\u00e4hrlich"},"recurring_intervals":{"default":"regelm\u00e4ssig","weekly":"w\u00f6chentlich","monthly":"monatlich","quarterly":"viertelj\u00e4hrlich","semestral":"halbj\u00e4hrlich","yearly":"j\u00e4hrlich"},"payment_methods":{"es":"Einzahlungsschein","sms":"SMS","pfc":"PostFinance Card","pef":"PostFinance E-Finance","pp":"PayPal","pex":"PayPal","vis":"VISA","eca":"Master Card","amx":"American Express","din":"Diners Club \/ Discover Card","dd":"LSV \/ DD","twi":"TWINT","mpw":"Masterpass"},"payment_addons":{"es":{"download":"(Download)","mail":"(Post)"}}},"confirmation":{"subject":"Vielen Dank f\u00fcr Ihre Spende!","intro":"{{ salutation_long }} {{ lastname }}","text":["Herzlichen Dank f\u00fcr Ihre Unterst\u00fctzung!","Wir freuen uns, Ihnen Ihre Spende f\u00fcr MMMM - Heartfull Mind zu best\u00e4tigen.","","Nachfolgend die Einzelheiten:","Spende zugunsten von: MMMM - Heartfull Mind {{ stored_rnw_purpose_text }}\nZahlungsart: {{ payment_method }}\nGespendeter Betrag: {{ amount }}\nTransaktionsnummer: {{ transaction_id }}\n\nIhre Kontaktdaten:\n{{ salutation }}\n{{ firstname }} {{ lastname }}\n{{ address }}\n\nNewsletter: {% if (stored_customer_email_permission == 'true') %}ja{%else%}nein{% endif %}\n\nSpendenbest\u00e4tigung: {% if (stored_customer_donation_receipt == 'true')%}ja{%else%}nein{% endif %}\n\nIhre Bemerkungen:\n{{ stored_customer_message }}","","F\u00fcr Fragen zu Ihrer Spende oder zu unserer T\u00e4tigkeit steht Ihnen unser Spenderservice gerne zur Verf\u00fcgung. Sie erreichen uns telefonisch unter {{ feedback_phone }} oder per E-Mail {{ feedback_email }}."],"outro":"Wir danken Ihnen ganz herzlich f\u00fcr Ihre Spende!","postscript":"Die Spende wird vom Verein FairGive treuh\u00e4nderisch entgegengenommen und direkt an MMMM - Heartfull Mind weitergeleitet.","footer":"Ihr MMMM - Heartfull Mind-Team"},"confirmation_es":{"subject":"Vielen Dank f\u00fcr Ihre Spende!","intro":"{{ salutation_long }} {{ lastname }}","text":["Herzlichen Dank f\u00fcr Ihre Unterst\u00fctzung!","Wir freuen uns, Ihnen Ihre Spende f\u00fcr MMMM - Heartfull Mind zu best\u00e4tigen. Mit einem elektronischen Einzahlungssschein spenden Sie besonders kosteng\u00fcnstig und effizient. Herzlichen Dank f\u00fcr Ihre Unterst\u00fctzung. Nachfolgend die Einzelheiten:","Spende zugunsten von: MMMM - Heartfull Mind {{ stored_rnw_purpose_text }}\nZahlungsart: {{ payment_method }}\nGespendeter Betrag: {{ amount }}\nTransaktionsnummer: {{ transaction_id }}\nLink zu Ihrem Einzahlungsschein: {{ espayment_pdflink }}\n\nIhre Kontaktdaten:\n{{ salutation }}\n{{ firstname }} {{ lastname }}\n{{ address }}\n\nNewsletter: {% if (stored_customer_email_permission == 'true') %}ja{%else%}nein{% endif %}\n\nSpendenbest\u00e4tigung: {% if (stored_customer_donation_receipt == 'true')%}ja{%else%}nein{% endif %}\n\nIhre Bemerkungen:\n{{ stored_customer_message }}","","F\u00fcr Fragen zu Ihrer Spende oder zu unserer T\u00e4tigkeit steht Ihnen unser Spenderservice gerne zur Verf\u00fcgung. Sie erreichen uns telefonisch unter {{ feedback_phone }}, per E-Mail {{ feedback_email }} ."],"outro":"Wir danken Ihnen ganz herzlich f\u00fcr Ihre Spende!","postscript":"","footer":"Ihr MMMM - Heartfull Mind-Team"},"confirmation_es_true":{"subject":"Vielen Dank f\u00fcr Ihre Spende!","intro":"{{ salutation_long }} {{ lastname }}","text":["Herzlichen Dank f\u00fcr Ihre Unterst\u00fctzung!","Wir freuen uns, Ihnen Ihre Spende f\u00fcr MMMM - Heartfull Mind zu best\u00e4tigen. Wir werden Ihnen die gew\u00fcnschten Einzahlungsscheine so rasch als m\u00f6glich zuschicken. Gleichzeitig m\u00f6chten wir Ihnen schon im Voraus f\u00fcr Ihre grossz\u00fcgige Unterst\u00fctzung danken. Nachfolgend die Einzelheiten:","Spende zugunsten von: MMMM - Heartfull Mind {{ stored_rnw_purpose_text }}\nZahlungsart: {{ payment_method }}\nGespendeter Betrag: {{ amount }}\nTransaktionsnummer: {{ transaction_id }}\n\nIhre Kontaktdaten:\n{{ salutation }}\n{{ firstname }} {{ lastname }}\n{{ address }}\n\nNewsletter: {% if (stored_customer_email_permission == 'true') %}ja{%else%}nein{% endif %}\n\nSpendenbest\u00e4tigung: {% if (stored_customer_donation_receipt == 'true')%}ja{%else%}nein{% endif %}\n\nIhre Bemerkungen:\n{{ stored_customer_message }}","","F\u00fcr Fragen zu Ihrer Spende oder zu unserer T\u00e4tigkeit steht Ihnen unser Spenderservice gerne zur Verf\u00fcgung. Sie erreichen uns telefonisch unter {{ feedback_phone }}, per E-Mail {{ feedback_email }} ."],"outro":"Wir danken Ihnen ganz herzlich f\u00fcr Ihre Spende!","postscript":"","footer":"Ihr MMMM - Heartfull Mind-Team"},"confirmation_dd":{"subject":"Vielen Dank f\u00fcr Ihre Spende!","intro":"{{ salutation_long }} {{ lastname }}","text":["Herzlichen Dank f\u00fcr Ihre Unterst\u00fctzung!","Wir freuen uns, Ihnen Ihre Spende f\u00fcr MMMM - Heartfull Mind zu best\u00e4tigen. Nachfolgend die Einzelheiten:","Spende zugunsten von: MMMM - Heartfull Mind {{ stored_rnw_purpose_text }}\nZahlungsart: {{ payment_method }}\nGespendeter Betrag: {{ amount }} {{ stored_translated_recurring_interval }}\nTransaktionsnummer: {{ transaction_id }}\nLink zu Ihrem LSV Formular: {{ pdflink }}\n\nIhre Kontaktdaten:\n{{ salutation }}\n{{ firstname }} {{ lastname }}\n{{ address }}\n\nNewsletter: {% if (stored_customer_email_permission == 'true') %}ja{%else%}nein{% endif %}\n\nSpendenbest\u00e4tigung: {% if (stored_customer_donation_receipt == 'true')%}ja{%else%}nein{% endif %}\n\nIhre Bemerkungen:\n{{ stored_customer_message }}","","F\u00fcr Fragen zu Ihrer Spende oder zu unserer T\u00e4tigkeit steht Ihnen unser Spenderservice gerne zur Verf\u00fcgung. Sie erreichen uns telefonisch unter {{ feedback_phone }}, per E-Mail {{ feedback_email }} ."],"outro":"Wir danken Ihnen ganz herzlich f\u00fcr Ihre Spende!","postscript":"","footer":"Ihr MMMM - Heartfull Mind-Team"},"subscription":{"event_subscribe":{"subject":"Danke f\u00fcr Ihre regelm\u00e4ssige Spende!","intro":"{{ salutation_long }} {{ lastname }}","text":["Herzlichen Dank f\u00fcr Ihre Zusage \u00fcber eine Spende von {{ amount }}, die Sie unseren wichtigen Projekten {{ interval }} zukommen lassen. Wir werden den Betrag gem\u00e4ss Ihrer Zusage k\u00fcnftig automatisch belasten. Als gew\u00fcnschte Zahlungsart haben Sie Folgendes angegeben: {{ payment_method }} {{ masked_cc }}."," ","Spende zugunsten von: MMMM - Heartfull Mind {{ stored_rnw_purpose_text }}\nZahlungsart: {{ payment_method }}\nGespendeter Betrag: {{ amount }}\nTransaktionsnummer: {{ transaction_id }}\nInterval: {{ interval }}\n\nIhre Kontaktdaten:\n{{ salutation }}\n{{ firstname }} {{ lastname }}\n{{ address }}\n\nNewsletter: {% if (stored_customer_email_permission == 'true') %}ja{%else%}nein{% endif %}\n\nSpendenbest\u00e4tigung: {% if (stored_customer_donation_receipt == 'true')%}ja{%else%}nein{% endif %}\n\nIhre Bemerkungen:\n{{ stored_customer_message }}"," ","Sie werden per E-Mail \u00fcber jede Spendenzahlung informiert und haben die M\u00f6glichkeit, Ihre Zahlungsangaben anzupassen oder Ihre Unters\u00fctzung zu beenden."," ","Regelm\u00e4ssige Spenden sind f\u00fcr unsere Projekte sehr wichtig: Sie reduzieren unsere Administrationskosten und machen die Projektplanung berechenbarer. Nochmals herzlichen Dank."],"outro":"Mit freundlichen Gr\u00fcssen","postscript":"Die Spende wird vom Verein FairGive treuh\u00e4nderisch entgegengenommen und direkt an MMMM - Heartfull Mind weitergeleitet.","footer":"Ihr MMMM - Heartfull Mind-Team"},"event_charged":{"subject":"Ihre regelm\u00e4ssige Spende f\u00fcr  MMMM - Heartfull Mind","intro":"{{ salutation_long }} {{ lastname }}","text":["Vielen Dank f\u00fcr Ihre {{ interval }} Spende zugunsten von  MMMM - Heartfull Mind.  Wie gew\u00fcnscht, haben wir Ihnen am {{ date }} {{ amount }} belastet. Sie haben daf\u00fcr folgendes Zahlungsmittel angegeben: {{ payment_method }} {{ masked_cc }}."," ","M\u00f6chten Sie Ihr Zahlungsmittel anpassen?","Bitte klicken Sie hier - {{ subscription_edit_url|raw }}"," ","M\u00f6chten Sie ihre Zusage annullieren?","Bitte klicken Sie hier - {{ subscription_edit_url|raw }}"," ","Wenn Sie Fragen oder R\u00fcckmeldungen haben wenden Sie sich bitte direkt per Telefon {{ feedback_phone }} oder E-mail {{ feedback_email }} an uns."," ","Nochmals ganz herzlichen Dank f\u00fcr Ihr Engagement."],"outro":"Viele Gr\u00fcsse","postscript":"Die Spende wird vom Verein FairGive treuh\u00e4nderisch entgegengenommen und direkt an MMMM - Heartfull Mind weitergeleitet.","footer":"Ihr MMMM - Heartfull Mind-Team"},"event_renew":{"subject":"Ihre regelm\u00e4ssige Spende f\u00fcr MMMM - Heartfull Mind","intro":"{{ salutation_long }} {{ lastname }}","text":["Vielen Dank f\u00fcr die Anpassung Ihres Zahlungsmittels f\u00fcr die  {{ interval }} Spende zugunsten von  MMMM - Heartfull Mind. Sie haben daf\u00fcr neu folgendes Zahlungsmittel erfasst: {{ payment_method }} {{ masked_cc }}."," ","Spende zugunsten von:  MMMM - Heartfull Mind {{ stored_rnw_purpose_text }}\nZahlungsart: {{ payment_method }}\nGespendeter Betrag: {{ amount }} {{ interval }}\nTransaktionsnummer: {{ transaction_id }}\n\nIhre Kontaktdaten:\n{{ salutation }}\n{{ firstname }} {{ lastname }}\n{{ address }}\n\nIhre Bemerkungen:\n{{ stored_customer_message }}"," ","Wenn Sie Fragen oder R\u00fcckmeldungen haben wenden Sie sich bitte direkt per Telefon {{ feedback_phone }} oder E-mail {{ feedback_email }} an uns.","M\u00f6chten Sie Ihre Spendenzusage \u00e4ndern?","Bitte klicken Sie hier - {{ subscription_edit_url|raw }}"," ","Nochmals vielen Dank!"],"outro":"Viele Gr\u00fcsse","postscript":"Die Spende wird vom Verein FairGive treuh\u00e4nderisch entgegengenommen und direkt an MMMM - Heartfull Mind weitergeleitet.","footer":"Ihr MMMM - Heartfull Mind-Team"},"event_charge_error":{"subject":"Belastungsproblem bei Ihrer regelm\u00e4ssigen Spende f\u00fcr  MMMM - Heartfull Mind","intro":"{{ salutation_long }} {{ lastname }}","text":["Sie \u00fcberweisen uns {{ interval }} eine Spende von {{ amount }}. Leider konnten wir am {{ date }} Ihr Konto nicht belasten. M\u00f6glicherweise ist Ihre {{ payment_method }} {{ masked_cc }} als Zahlungsmittel abgelaufen, gesperrt oder Sie haben Ihr Limit erreicht."," ","M\u00f6chten Sie Ihre Zahlungsangaben anpassen?","Bitte klicken Sie hier - {{ subscription_edit_url|raw }}"," ","Wurde Ihr Limit erreicht? Wir versuchen beim n\u00e4chstm\u00f6glichen Termin Ihre Spende abzubuchen. Sie m\u00fcssen nichts unternehmen; Sie erhalten eine entsprechende Best\u00e4tigung per E-Mail.","Wenn Sie Hilfe ben\u00f6tigen oder Fragen haben rufen Sie uns gerne an unter {{ feedback_phone }} oder schicken Sie uns eine E-mail an {{ feedback_email }}.","Herzlichen Dank f\u00fcr Ihr Engagement!"],"outro":"Mit den besten Gr\u00fcssen","postscript":"Die Spende wird vom Verein FairGive treuh\u00e4nderisch entgegengenommen und direkt an MMMM - Heartfull Mind weitergeleitet.","footer":"Ihr MMMM - Heartfull Mind-Team"},"event_cancel":{"subject":"K\u00fcndigungsbest\u00e4tigung f\u00fcr Ihre Spende f\u00fcr MMMM - Heartfull Mind","intro":"{{ salutation_long }} {{ lastname }}","text":["Sie haben uns mitgeteilt, dass Sie nicht mehr regelm\u00e4ssig f\u00fcr unsere Projekte spenden m\u00f6chten. Wir werden Ihr Konto \u2013 {{ payment_method }} {{ masked_cc }} \u2013 nicht mehr belasten.","","Ihre Kontaktdaten:\n{{ salutation }}\n{{ firstname }} {{ lastname }}\n{{ address }}","","Wir bedauern Ihren Entscheid sehr und w\u00fcrden sehr gerne den Grund Ihrer K\u00fcndigung erfahren. Bitte nehmen Sie sich hierf\u00fcr kurz Zeit. Senden Sie eine E-Mail an {{ feedback_email }} oder rufen Sie an unter {{ feedback_phone }}. F\u00fcr Ihre  bisherige Unterst\u00fctzung  bedanken wir uns sehr und hoffen, dass Sie unsere Arbeit in Zukunft einmal wieder mit einer Spende unterst\u00fctzen k\u00f6nnen."],"outro":"Mit herzlichen Gr\u00fcssen","postscript":"","footer":"Ihr MMMM - Heartfull Mind-Team"}}},"countries":{"CH":"Schweiz","DE":"Deutschland","FR":"Frankreich","IT":"Italien","AF":"Afghanistan","AL":"Albanien","DZ":"Algerien","AS":"Amerikanisch-Samoa","AD":"Andorra","AO":"Angola","AI":"Anguilla","AQ":"Antarktis","AG":"Antigua und Barbuda","AR":"Argentinien","AM":"Armenien","AW":"Aruba","AZ":"Aserbeidschan","AU":"Australien","BS":"Bahamas","BH":"Bahrain","BD":"Bangladesh","BB":"Barbados","BY":"Belarus","BE":"Belgien","BZ":"Belize","BJ":"Benin","BM":"Bermuda-Inseln","BT":"Bhutan","BO":"Bolivien","BA":"Bosnien-Herzegowina","BW":"Botswana","BV":"Bouvet Inseln","BR":"Brasilien","IO":"Britische Territorien im Indischen Ozean","BG":"Bulgarien","BF":"Burkina Faso","BI":"Burundi","CL":"Chile","CN":"China","CO":"Columbien","CK":"Cook-Inseln","CR":"Costa Rica","DJ":"Djibouti","DM":"Dominica","DO":"Dominikanische Republik","DK":"D\u00e4nemark","SV":"El Salvador","CI":"Elfenbeink\u00fcste","EC":"Equador","ER":"Eritrea","EE":"Estland","FK":"Falkland-Inseln","FJ":"Fidschi","FI":"Finnland","TF":"Franz. S\u00fcdpolarterritorien","GF":"Franz\u00f6sisch-Guyana","PF":"Franz\u00f6sisch-Polynesien","FO":"F\u00e4r\u00f6er-Inseln","GA":"Gabun","GM":"Gambia","GE":"Georgien","GH":"Ghana","GI":"Gibraltar","GD":"Grenada","GR":"Griechenland","GB":"Grossbritanien","GL":"Gr\u00f6nland","GP":"Guadeloupe","GU":"Guam","GT":"Guatemala","GG":"Guernsey","GN":"Guinea","GW":"Guinea-Bissau","GY":"Guyana","HT":"Haiti","HM":"Heard- MacDonal-Iseln","HN":"Honduras","HK":"Hong Kong","IN":"Indien","ID":"Indonesien","IM":"Insel Man","IQ":"Irak","IR":"Iran","IE":"Irland","IS":"Island","IL":"Israel","JM":"Jamaika","JP":"Japan","JE":"Jersey","JO":"Jordan","VG":"Jungfern-Inseln (UK)","VI":"Jungfern-Inseln (USA)","KY":"Kaiman-Inseln","KH":"Kambodscha","CM":"Kamerun","CA":"Kanada","CV":"Kapverden","KZ":"Kasachstan","QA":"Katar","KE":"Kenia","KG":"Kirgistan","KI":"Kiribati","CC":"Kokos-Inseln","KM":"Komoren","CG":"Kongo","CD":"Kongo (Demokratische Republik)","XK":"Kosovo","HR":"Kroatien","CU":"Kuba","KW":"Kuwait","LA":"Laos","LS":"Lesotho","LV":"Lettland","LB":"Libanon","LR":"Liberia","LI":"Liechtenstein","LT":"Litauen","LU":"Luxemburg","LY":"Lybien","MO":"Mac\u00e3o","MG":"Madagaskar","MW":"Malawi","MY":"Malaysia","MV":"Malediven","ML":"Mali","MT":"Malta","MA":"Marokko","MH":"Marshall-Inseln","MQ":"Martinique","MR":"Mauretanien","MU":"Mauritius","YT":"Mayotte","MK":"Mazedonien","MX":"Mexiko","FM":"Mikronesien","MD":"Moldawien","MC":"Monaco","MN":"Mongolei","ME":"Montenegro","MS":"Montserrat","MZ":"Mosambik","MM":"Myanmar","NA":"Namibien","NR":"Nauru","NP":"Nepal","NC":"Neukaledonien","NZ":"Neuseeland","NI":"Nicaragua","NL":"Niederlande","AN":"Niederl\u00e4ndische Antillen","NE":"Niger","NG":"Nigeria","NU":"Niue","KP":"Nordkorea","MP":"Nordliche Mariannen Insel","NF":"Norfolk-Insel","NO":"Norwegen","OM":"Oman","PK":"Pakistan","PW":"Palau","PS":"Palestina","PA":"Panama","PG":"Papua-Neuguinea","PY":"Paraguay","PE":"Peru","PH":"Philippinen","PN":"Pitcairn-Inseln","PL":"Polen","PT":"Portugal","PR":"Puerto Rico","RW":"Ruanda","RO":"Rum\u00e4nien","RU":"Russland (Russiche F\u00f6deration)","RE":"R\u00e9union","KN":"Saint Kitts und Nevis","MF":"Saint Martin (Franz\u00f6sischer Teil)","SB":"Salomon-Inseln","ZM":"Sambia","WS":"Samoa","SM":"SanMarino","BL":"Sankt Bartholom\u00e4us","SA":"Saudi Arabien","SE":"Schweden","SN":"Senegal","RS":"Serbien","SC":"Seyschellen","SL":"Sierra Leone","ZW":"Simbabwe","SG":"Singapur","SK":"Slowakei","SI":"Slowenien","SO":"Somalia","ES":"Spanien","LK":"Sri Lanka","SH":"St. Helena","LC":"St. Lucia","PM":"St. Pierre und Miquelon","VC":"St. Vincent und die Grenadinen","SD":"Sudan","SR":"Surinam","SJ":"Svalbard und Jan Mayen","SZ":"Swasiland","SY":"Syrien","ST":"S\u00e3oTom\u00e9 und Principe","GS":"S\u00fcd Georgia und die s\u00fcdlichen Sandwich Inseln","ZA":"S\u00fcdafrika","KR":"S\u00fcdkorea","TJ":"Tadschikistan","TW":"Taiwan","TZ":"Tansania","TH":"Thailand","TL":"Timor-Leste","TG":"Togo","TK":"Tokelau","TO":"Tonga","TT":"Trinidad und Tobago","TD":"Tschad","CZ":"Tschechische Republik","TN":"Tunesien","TM":"Turkmenistan","TC":"Turks- Caicos-Isen","TV":"Tuvalu","TR":"T\u00fcrkei","UG":"Uganda","UA":"Ukraine","HU":"Ungarn","UY":"Uruguay","UZ":"Usbekistan","VU":"Vanuatu","VA":"Vatikanstadt","VE":"Venezuela","AE":"Vereinigete Arabische Emirate","US":"Vereinigte Staaten von Amerika","VN":"Vietnam","WF":"Wallis und Futuna","CX":"Weihnachtsinsel","BN":"Weissrussland","EH":"Westsahara","YE":"Yemen","CF":"Zentralafrikanische Republik","CY":"Zypern","EG":"\u00c4gypten","GQ":"\u00c4quatorialguinea","ET":"\u00c4thiopien","AX":"\u00c5land","AT":"\u00d6sterreich","UM":"\u00dcbrige Inseln im Pazifik der USA"}};rnwWidget.widgets["lema"]["configurations"]["mmmm-426af"].urlToWidget = "https://widget.raisenow.com/widgets/lema/";rnwWidget.widgets["lema"]["configurations"]["mmmm-426af"].merchantConfig = "mmmm-426af";rnwWidget.widgets["lema"]["configurations"]["mmmm-426af"].widgetName = "lema";rnwWidget.widgets["lema"]["configurations"]["mmmm-426af"].widgetUUID = "mmmm-426af";rnwWidget.widgets["lema"]["configurations"]["mmmm-426af"].widgetParams = {"common":{"scripts":["_default\/js\/select2\/select2.js","_default\/js\/placeholder.js","_default\/js\/ICanHaz.js","_default\/js\/jquery.validate.js","_default\/js\/widget.utils.js","_default\/js\/widget.widget-parameter-utils.js","_default\/js\/widget.base.js","_default\/js\/widget.modules-base.js","_default\/js\/epik.js","_default\/js\/customizedscript.js","_default\/js\/ddswidget-core.js"],"css":["_default\/css\/styles-neutral.css"],"base_url":"https:\/\/widget.raisenow.com","base_path":"\/widgets\/","default_lang":"de","payment_type":"both","allowed_cc_types":["vis","amx","eca"],"min_amount":{"single":1,"recurring":{"monthly":20,"quarterly":60,"semestral":120,"yearly":240}},"payment_method_selection_mode":"accordion","sid":488,"keyword":"GETUDEV","supported_iban_countries":["CH","AT","DE"],"enable_google_analytics":true,"enable_autoscroll_successpage":true,"jquery_version":"3.2.1"},"capabilities":{"has_initializer":true},"intervals":{"mode":"jit","weekly":{"expression":"weekly","type":"non-immediate"},"monthly":{"expression":"monthly","type":"non-immediate"},"quarterly":{"expression":"quarterly","type":"non-immediate"},"semestral":{"expression":"semestral","type":"non-immediate"},"yearly":{"expression":"yearly","type":"non-immediate"}},"payment_methods":{"twi":{"recurrence":"single","redirect_in":"self","address_required":true},"cc":{"recurrence":"both","address_required":true},"mpw":{"recurrence":"single","redirect_in":"self","address_required":true},"pf":{"pef":{"recurrence":"single","redirect_in":"self","address_required":true},"pfc":{"recurrence":"both","redirect_in":"self","address_required":true}}},"process":{"steps":["amount","payment-method","customer-identity","customer-address","customer-address-compact-mode"],"blocks":{"show":["customer_company","customer_pobox"],"hide":["customer_birthdate","customer_street2","recipient_street2"]},"prevent_donation_receipt_toggle":true},"fallback_keys":{"confirmation_text":{"base":"payment.success","hierarchy":["payment_method","stored_es_ordered"]},"confirmation_mail":{"base":"email.confirmation","hierarchy":["payment_method","stored_es_ordered"]},"event_mail":{"base":"email.subscription.event","hierarchy":["event","payment_method"]}}};rnwWidget.widgets["lema"]["configurations"]["mmmm-426af"].legacy = {};rnwWidget.widgets["lema"]["configurations"]["mmmm-426af"].legacy = {"country":"ch","origin":"normal"};
        return rnwWidget.widgets['lema']['configurations']['mmmm-426af'];
    }

    function loadJavascript() {
        var parameters = addParametersToDdsWidgetConfig();

        scriptUrl = scripts.shift();
        if (scriptUrl) {
            scriptUrl = preferredUrl + scriptUrl;
            scriptTag = document.createElement('script');
            scriptTag.setAttribute('type', 'text/javascript');
            scriptTag.setAttribute('src', scriptUrl);
            if (scriptTag.readyState) {
                scriptTag.onreadystatechange = function () { // For old versions of IE
                    if (this.readyState === 'complete' || this.readyState === 'loaded') {
                        scriptLoaderHandler();
                    }
                };
            } else { // Other browsers
                scriptTag.onload = scriptLoaderHandler;
            }
            // Try to find the head, otherwise default to the documentElement
            (document.getElementsByTagName('head')[0]
                                || document.documentElement).appendChild(scriptTag);
        } else {
            initializeWidgets(parameters);
        }
    }

    function initializeWidgets(parameters) {
        var jsonpTemplateUrl = preferredUrl + basePath + 'dds-widget-de.html?callback=?',
            caps = parameters.widgetParams.capabilities || {},
            ieversion = false;

        if(devMode) {
            jsonpTemplateUrl = preferredUrl + '/widgets/lema/_default/htmlgenerator.php?callback=?&widget-uuid=mmmm-426af&lang=de&dev=true';
        }
        jQueryFix.extend(parameters, {
            jsonpTemplateUrl: jsonpTemplateUrl,
            widgetBaseUrl: baseUrl,
            widgetConfigUrl: baseUrl + basePath,
            widgetDefaultUrl: baseUrl + '/widgets/lema/_default/',
            widgetCdnUrl: cdnUrl,
            widgetPreferredUrl: preferredUrl,
            css: css,
            scripts: scripts,
        });

        if (caps.has_initializer === true) {
            initializeWithInitializer(parameters);
        } else {
            // old way of injecting CSS
            if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) { //test for MSIE x.x;
                ieversion = new Number(RegExp.$1); // capture x.x portion and store as a number
            }
            if (ieversion >= 9 || ieversion === false) {
                css.push('/widgets/lema/_default/css/radio_checkbox.css');
            }
            while(css.length > 0) {
                addCssTag(preferredUrl + css.shift());
            }
            if(ddsWidgetConfig.css !== 'undefined') {
                 addCssTag(ddsWidgetConfig.css);
            }

            // old way of adding template markup independent of widget implementation
            jQueryFix.ajax({
                url: jsonpTemplateUrl,
                type: 'GET',
                cache: false,
                dataType: 'jsonp',
                jsonpCallback : 'getWidgetTemplate',
                crossDomain: true,
                success: function (data) {
                    jQueryFix(data).appendTo(jQueryFix('.dds-widget-container'));
                    window.initWidget(parameters);
                }
            });
        }

        if (parameters.widgetParams.common.enable_google_analytics !== false) {
            initializeGoogleAnalytics(parameters);
        }

        if (parameters.widgetParams.common.enable_bugsnag === true && parameters.widgetParams.common.bugsnag_api_key) {
            initializeBugsnag(parameters.widgetParams.common.bugsnag_api_key);
        }
    }

    function initializeWithInitializer(widgetConfig) {
        // The 'order' variable is used as a fallback mechanism for legacy compatibility. If there are no
        // widget containers with the 'data-widget' attribute matching the current widget name, it will
        // initialize all widgent containers _without_ a data-widget attribute
        var order = ['.dds-widget-container[data-widget="' + widgetConfig.widgetName + '"]', '.dds-widget-container:not([data-widget])'],
            matches, i;

        for (i = 0; i < order.length; i++) {
            matches = jQueryFix(order[i]);
            if (matches.length > 0)
            {
                matches.each(function (index, element) {
                    // instantiate the widget using the registered initializer function
                    var instance = new window.rnwWidget.widgets[widgetConfig.widgetName].initializer(jQueryFix, jQueryFix(this), widgetConfig);
                    // store the instance - it is used from return pages to trigger response processing
                    window.rnwWidget.widgets.instances[instance.id] = instance;
                });
                break;
            }
        }
    }

    function initializeGoogleAnalytics(parameters) {
        // only create a GoogleAnalytics 'ga' object if there isn't one already, otherwise this
        // would load the analytics.js script a second time which increases overall load time
        if (window.ga === undefined) {
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
              m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
        }

        // create a custom _named_ tracker for the widget tracking requests to avoid any
        // potential conflicts with existing GoogleAnalytics code on the target page
        ga('create', 'UA-688857-69', 'raisenow.com', {'name': 'rnwWidgetTracker'});
        ga('rnwWidgetTracker.send', 'pageview', {'location' : window.location.protocol + '//' + window.location.hostname + window.location.pathname + window.location.search, 'page' : '/' + parameters.epikOptions.apiendpoint.replace(/(.*)\//g, "") + '/' + parameters.widgetName + '/' + parameters.widgetUUID + '/' + window.location.hostname + window.location.pathname + window.location.search});
    }

    function initializeBugsnag(apiKey) {
        (function (i, s, o, g, r, a, m) {
            a = s.createElement(o);
            m = s.getElementsByTagName(o)[0];
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m);

            (function init() {
                if(i.bugsnag) {
                    i.rnwWidget.utils[r] = i.bugsnag(apiKey);
                } else {
                    setTimeout(init, 1000);
                }
            })();
        })(window, document, 'script', '//widget.raisenow.com/widgets/lema/_default/js/bugsnag.min.js', 'bugsnagClient');
    }

})({scripts:["/widgets/lema/mmmm-426af/js/dds-widget-de.min.js"],css:["/widgets/lema/mmmm-426af/css/dds-widget.min.css"],baseUrl:"https://widget.raisenow.com",cdnBaseUrl:"",basePath:"/widgets/lema/mmmm-426af/"}, {scripts:["/widgets/lema/_default/js/select2/select2.js","/widgets/lema/_default/js/placeholder.js","/widgets/lema/_default/js/ICanHaz.js","/widgets/lema/_default/js/jquery.validate.js","/widgets/lema/_default/js/widget.utils.js","/widgets/lema/_default/js/widget.widget-parameter-utils.js","/widgets/lema/_default/js/widget.base.js","/widgets/lema/_default/js/widget.modules-base.js","/widgets/lema/_default/js/epik.js","/widgets/lema/mmmm-426af/js/customizedscript-de.js","/widgets/lema/_default/js/ddswidget-core.js"],css:["/widgets/lema/_default/css/styles-neutral.css"],baseUrl:"https://widget.raisenow.com",cdnBaseUrl:"",basePath:"/widgets/lema/mmmm-426af/"});

