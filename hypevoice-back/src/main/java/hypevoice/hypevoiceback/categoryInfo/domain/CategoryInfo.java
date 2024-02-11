package hypevoice.hypevoiceback.categoryInfo.domain;

import hypevoice.hypevoiceback.work.domain.Work;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor
@Table(name = "category_info")
public class CategoryInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_info_id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "work_id", referencedColumnName = "work_id")
    private Work work;

    @Convert(converter = MediaClassification.MediaClassificationConverter.class)
    private MediaClassification mediaClassification;

    @Convert(converter = VoiceTone.VoiceToneConverter.class)
    private VoiceTone voiceTone;

    @Convert(converter = VoiceStyle.VoiceStyleConverter.class)
    private VoiceStyle voiceStyle;

    @Convert(converter = Gender.GenderConverter.class)
    private Gender gender;

    @Convert(converter = Age.AgeConverter.class)
    private Age age;

    @Builder
    private CategoryInfo(Work work, MediaClassification mediaClassification, VoiceTone voiceTone, VoiceStyle voiceStyle, Gender gender, Age age) {
        this.work = work;
        this.mediaClassification = mediaClassification;
        this.voiceTone = voiceTone;
        this.voiceStyle = voiceStyle;
        this.gender = gender;
        this.age = age;
    }

    public static CategoryInfo createCategoryInfo(Work work, MediaClassification mediaClassification, VoiceTone voiceTone, VoiceStyle voiceStyle, Gender gender, Age age) {
        return new CategoryInfo(work, mediaClassification, voiceTone, voiceStyle, gender, age);
    }

    public void updateCategoryInfo(MediaClassification mediaClassification, VoiceTone voiceTone, VoiceStyle voiceStyle, Gender gender, Age age) {
        this.mediaClassification = mediaClassification;
        this.voiceTone = voiceTone;
        this.voiceStyle = voiceStyle;
        this.gender = gender;
        this.age = age;
    }
}
