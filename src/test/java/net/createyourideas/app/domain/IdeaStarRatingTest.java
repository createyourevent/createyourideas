package net.createyourideas.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import net.createyourideas.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class IdeaStarRatingTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(IdeaStarRating.class);
        IdeaStarRating ideaStarRating1 = new IdeaStarRating();
        ideaStarRating1.setId(1L);
        IdeaStarRating ideaStarRating2 = new IdeaStarRating();
        ideaStarRating2.setId(ideaStarRating1.getId());
        assertThat(ideaStarRating1).isEqualTo(ideaStarRating2);
        ideaStarRating2.setId(2L);
        assertThat(ideaStarRating1).isNotEqualTo(ideaStarRating2);
        ideaStarRating1.setId(null);
        assertThat(ideaStarRating1).isNotEqualTo(ideaStarRating2);
    }
}
