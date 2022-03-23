package net.createyourideas.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import net.createyourideas.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DonationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Donation.class);
        Donation donation1 = new Donation();
        donation1.setId(1L);
        Donation donation2 = new Donation();
        donation2.setId(donation1.getId());
        assertThat(donation1).isEqualTo(donation2);
        donation2.setId(2L);
        assertThat(donation1).isNotEqualTo(donation2);
        donation1.setId(null);
        assertThat(donation1).isNotEqualTo(donation2);
    }
}
