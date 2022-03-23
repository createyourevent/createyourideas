package net.createyourideas.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import net.createyourideas.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class IdeaLikeDislikeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(IdeaLikeDislike.class);
        IdeaLikeDislike ideaLikeDislike1 = new IdeaLikeDislike();
        ideaLikeDislike1.setId(1L);
        IdeaLikeDislike ideaLikeDislike2 = new IdeaLikeDislike();
        ideaLikeDislike2.setId(ideaLikeDislike1.getId());
        assertThat(ideaLikeDislike1).isEqualTo(ideaLikeDislike2);
        ideaLikeDislike2.setId(2L);
        assertThat(ideaLikeDislike1).isNotEqualTo(ideaLikeDislike2);
        ideaLikeDislike1.setId(null);
        assertThat(ideaLikeDislike1).isNotEqualTo(ideaLikeDislike2);
    }
}
