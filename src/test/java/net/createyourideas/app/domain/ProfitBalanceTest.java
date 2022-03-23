package net.createyourideas.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import net.createyourideas.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProfitBalanceTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProfitBalance.class);
        ProfitBalance profitBalance1 = new ProfitBalance();
        profitBalance1.setId(1L);
        ProfitBalance profitBalance2 = new ProfitBalance();
        profitBalance2.setId(profitBalance1.getId());
        assertThat(profitBalance1).isEqualTo(profitBalance2);
        profitBalance2.setId(2L);
        assertThat(profitBalance1).isNotEqualTo(profitBalance2);
        profitBalance1.setId(null);
        assertThat(profitBalance1).isNotEqualTo(profitBalance2);
    }
}
