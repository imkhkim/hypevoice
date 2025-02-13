package hypevoice.hypevoiceback.common;

import hypevoice.hypevoiceback.auth.domain.TokenRepository;
import hypevoice.hypevoiceback.board.domain.BoardRepository;
import hypevoice.hypevoiceback.categoryInfo.domain.CategoryInfoRepository;
import hypevoice.hypevoiceback.comment.domain.CommentRepository;
import hypevoice.hypevoiceback.member.domain.MemberRepository;
import hypevoice.hypevoiceback.studio.domain.StudioRepository;
import hypevoice.hypevoiceback.studiomember.domain.StudioMemberRepository;
import hypevoice.hypevoiceback.voice.domain.VoiceRepository;
import hypevoice.hypevoiceback.voice.domain.like.VoiceLikeRepository;
import hypevoice.hypevoiceback.work.domain.WorkRepository;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.AfterEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Transactional
public class ServiceTest {
    @Autowired
    private DatabaseCleaner databaseCleaner;

    @Autowired
    protected MemberRepository memberRepository;

    @Autowired
    protected TokenRepository tokenRepository;

    @Autowired
    protected BoardRepository boardRepository;

    @Autowired
    protected CommentRepository commentRepository;

    @Autowired
    protected VoiceRepository voiceRepository;

    @Autowired
    protected VoiceLikeRepository voiceLikeRepository;

    @Autowired
    protected WorkRepository workRepository;

    @Autowired
    protected StudioRepository studioRepository;

    @Autowired
    protected CategoryInfoRepository categoryInfoRepository;

    @Autowired
    protected StudioMemberRepository studioMemberRepository;

    @AfterEach
    void clearDatabase() {
        databaseCleaner.cleanUpDatabase();
    }

    public void flushAndClear() {
        databaseCleaner.flushAndClear();
    }
}