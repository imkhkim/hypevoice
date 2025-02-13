package hypevoice.hypevoiceback.file.service;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import hypevoice.hypevoiceback.file.exception.FileErrorCode;
import hypevoice.hypevoiceback.global.exception.BaseException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileService {
    private static final String MEMBER = "member";
    private static final String BOARD = "board";
    private static final String VOICE = "voice";
    private static final String WORK = "work";
    private static final String COMMENT = "comment";

    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    public String uploadMemberFiles(MultipartFile file) {
        validateFileExists(file);
        validateContentType(file); // 회원의 프로필 이미지만 업로드 가능
        return uploadFile(MEMBER, file);
    }

    public String uploadBoardFiles(MultipartFile file) {
        validateFileExists(file);
        return uploadFile(BOARD, file);
    }

    public String uploadVoiceFiles(MultipartFile file) {
        validateFileExists(file);
        validateContentType(file); // 보이스에는 프로필 이미지만 업로드 가능
        return uploadFile(VOICE, file);
    }

    public String uploadWorkFiles(MultipartFile file) {
        validateFileExists(file);
        return uploadFile(WORK, file);
    }

    public String uploadCommentFiles(MultipartFile file) {
        validateFileExists(file);
        return uploadFile(COMMENT, file);
    }

    public void deleteFiles(String uploadFileUrl) {
        if (uploadFileUrl == null || uploadFileUrl.isEmpty()) {
            throw BaseException.type(FileErrorCode.INVALID_DIR);
        }
        deleteFile(uploadFileUrl);
    }

    private void validateContentType(MultipartFile file) {
        String contentType = file.getContentType();
        if (!(contentType.equals("image/jpeg") || contentType.equals("image/png"))) {
            throw BaseException.type(FileErrorCode.NOT_AN_IMAGE);
        }
    }

    private void validateFileExists(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw BaseException.type(FileErrorCode.EMPTY_FILE);
        }
    }

    private String uploadFile(String dir, MultipartFile file) {
        String fileKey = createFilePath(dir, file.getOriginalFilename());

        ObjectMetadata objectMetadata = new ObjectMetadata();
        objectMetadata.setContentType(file.getContentType());
        objectMetadata.setContentLength(file.getSize());
        try {
            amazonS3.putObject(
                    bucket, fileKey, file.getInputStream(), objectMetadata
            );
        } catch (IOException e) {
            log.error("S3 파일 업로드 실패: {}", e.getMessage());
            throw BaseException.type(FileErrorCode.S3_UPLOAD_FAILED);
        }

        return amazonS3.getUrl(bucket, fileKey).toString();
    }

    private String createFilePath(String dir, String originalFileName) {
        String uuidName = UUID.randomUUID() + "_" + originalFileName;

        return switch (dir) {
            case MEMBER -> String.format("member/%s", uuidName);
            case BOARD -> String.format("board/%s", uuidName);
            case VOICE -> String.format("voice/%s", uuidName);
            case WORK -> String.format("work/%s", uuidName);
            case COMMENT -> String.format("comment/%s", uuidName);
            default -> throw BaseException.type(FileErrorCode.INVALID_DIR);
        };
    }

    private void deleteFile(String uploadFileUrl) {
        String fileKey = uploadFileUrl.substring(57);
        try {
            amazonS3.deleteObject(bucket, fileKey);
        } catch (AmazonServiceException e) {
            System.err.println(e.getErrorMessage());
            System.exit(1);
        }
    }
}