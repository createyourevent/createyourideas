package net.createyourideas.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import net.createyourideas.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class IdeaTransactionIdTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(IdeaTransactionId.class);
        IdeaTransactionId ideaTransactionId1 = new IdeaTransactionId();
        ideaTransactionId1.setId(1L);
        IdeaTransactionId ideaTransactionId2 = new IdeaTransactionId();
        ideaTransactionId2.setId(ideaTransactionId1.getId());
        assertThat(ideaTransactionId1).isEqualTo(ideaTransactionId2);
        ideaTransactionId2.setId(2L);
        assertThat(ideaTransactionId1).isNotEqualTo(ideaTransactionId2);
        ideaTransactionId1.setId(null);
        assertThat(ideaTransactionId1).isNotEqualTo(ideaTransactionId2);
    }
}
