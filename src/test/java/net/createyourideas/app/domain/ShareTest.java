package net.createyourideas.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import net.createyourideas.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ShareTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Share.class);
        Share share1 = new Share();
        share1.setId(1L);
        Share share2 = new Share();
        share2.setId(share1.getId());
        assertThat(share1).isEqualTo(share2);
        share2.setId(2L);
        assertThat(share1).isNotEqualTo(share2);
        share1.setId(null);
        assertThat(share1).isNotEqualTo(share2);
    }
}
