package net.createyourideas.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import net.createyourideas.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PropertiesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Properties.class);
        Properties properties1 = new Properties();
        properties1.setId(1L);
        Properties properties2 = new Properties();
        properties2.setId(properties1.getId());
        assertThat(properties1).isEqualTo(properties2);
        properties2.setId(2L);
        assertThat(properties1).isNotEqualTo(properties2);
        properties1.setId(null);
        assertThat(properties1).isNotEqualTo(properties2);
    }
}
