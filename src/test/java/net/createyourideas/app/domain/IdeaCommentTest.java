package net.createyourideas.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import net.createyourideas.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class IdeaCommentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(IdeaComment.class);
        IdeaComment ideaComment1 = new IdeaComment();
        ideaComment1.setId(1L);
        IdeaComment ideaComment2 = new IdeaComment();
        ideaComment2.setId(ideaComment1.getId());
        assertThat(ideaComment1).isEqualTo(ideaComment2);
        ideaComment2.setId(2L);
        assertThat(ideaComment1).isNotEqualTo(ideaComment2);
        ideaComment1.setId(null);
        assertThat(ideaComment1).isNotEqualTo(ideaComment2);
    }
}
