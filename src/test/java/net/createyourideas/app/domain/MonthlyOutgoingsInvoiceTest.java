package net.createyourideas.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import net.createyourideas.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MonthlyOutgoingsInvoiceTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MonthlyOutgoingsInvoice.class);
        MonthlyOutgoingsInvoice monthlyOutgoingsInvoice1 = new MonthlyOutgoingsInvoice();
        monthlyOutgoingsInvoice1.setId(1L);
        MonthlyOutgoingsInvoice monthlyOutgoingsInvoice2 = new MonthlyOutgoingsInvoice();
        monthlyOutgoingsInvoice2.setId(monthlyOutgoingsInvoice1.getId());
        assertThat(monthlyOutgoingsInvoice1).isEqualTo(monthlyOutgoingsInvoice2);
        monthlyOutgoingsInvoice2.setId(2L);
        assertThat(monthlyOutgoingsInvoice1).isNotEqualTo(monthlyOutgoingsInvoice2);
        monthlyOutgoingsInvoice1.setId(null);
        assertThat(monthlyOutgoingsInvoice1).isNotEqualTo(monthlyOutgoingsInvoice2);
    }
}
