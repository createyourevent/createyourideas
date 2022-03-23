package net.createyourideas.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import net.createyourideas.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MonthlyIncomeInvoiceTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MonthlyIncomeInvoice.class);
        MonthlyIncomeInvoice monthlyIncomeInvoice1 = new MonthlyIncomeInvoice();
        monthlyIncomeInvoice1.setId(1L);
        MonthlyIncomeInvoice monthlyIncomeInvoice2 = new MonthlyIncomeInvoice();
        monthlyIncomeInvoice2.setId(monthlyIncomeInvoice1.getId());
        assertThat(monthlyIncomeInvoice1).isEqualTo(monthlyIncomeInvoice2);
        monthlyIncomeInvoice2.setId(2L);
        assertThat(monthlyIncomeInvoice1).isNotEqualTo(monthlyIncomeInvoice2);
        monthlyIncomeInvoice1.setId(null);
        assertThat(monthlyIncomeInvoice1).isNotEqualTo(monthlyIncomeInvoice2);
    }
}
