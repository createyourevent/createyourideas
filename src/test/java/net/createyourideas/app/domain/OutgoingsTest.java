package net.createyourideas.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import net.createyourideas.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class OutgoingsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Outgoings.class);
        Outgoings outgoings1 = new Outgoings();
        outgoings1.setId(1L);
        Outgoings outgoings2 = new Outgoings();
        outgoings2.setId(outgoings1.getId());
        assertThat(outgoings1).isEqualTo(outgoings2);
        outgoings2.setId(2L);
        assertThat(outgoings1).isNotEqualTo(outgoings2);
        outgoings1.setId(null);
        assertThat(outgoings1).isNotEqualTo(outgoings2);
    }
}
