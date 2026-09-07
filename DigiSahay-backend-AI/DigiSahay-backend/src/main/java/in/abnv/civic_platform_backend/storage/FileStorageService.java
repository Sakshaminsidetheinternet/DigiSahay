package in.abnv.civic_platform_backend.storage;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;


@Service
public class FileStorageService {

    private final String uploadDir = "uploads/problems";

    public String saveFile(MultipartFile file) {

        try {

            Path uploadPath = Paths.get(uploadDir);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFileName = file.getOriginalFilename();

            String fileExtension = "";

            if (originalFileName != null &&
                    originalFileName.contains(".")) {

                fileExtension = originalFileName.substring(
                        originalFileName.lastIndexOf(".")
                );
            }

            String fileName =
                    UUID.randomUUID() + fileExtension;

            Path filePath =
                    uploadPath.resolve(fileName);

            Files.copy(
                    file.getInputStream(),
                    filePath
            );

            return "/uploads/problems/" + fileName;

        } catch (IOException e) {

            throw new RuntimeException(
                    "Could not upload file",
                    e
            );
        }
    }
    public String saveProposalFile(MultipartFile file) {
        try {
            Path uploadPath = Paths.get("uploads/proposals");
            if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);
            String original = file.getOriginalFilename();
            String ext = original != null && original.contains(".") ? original.substring(original.lastIndexOf('.')) : ".pdf";
            String fileName = UUID.randomUUID() + ext;
            Files.copy(file.getInputStream(), uploadPath.resolve(fileName));
            return "/uploads/proposals/" + fileName;
        } catch (IOException e) { throw new RuntimeException("Could not upload proposal", e); }
    }

}
