package com.project.dia.service;

import com.project.dia.dao.ProgramImageDAO;
import com.project.dia.dao.ReviewDAO;
import com.project.dia.dao.UserDAO;
import com.project.dia.dao.WorkshopDAO;
import com.project.dia.model.dto.FileUploadDTO;
import com.project.dia.model.vo.ProgramImage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class FileUploadService {

    @Autowired
    private ProgramImageDAO programImageDAO;
    @Autowired private WorkshopDAO workshopDAO;
    @Autowired private UserDAO userDAO;
    @Autowired private ReviewDAO reviewDAO;

    public List<String> uploadFiles(FileUploadDTO dto, List<MultipartFile> files) throws IOException {

        if (files == null || files.isEmpty()) return new ArrayList<>();

        String table = dto.getTable();
        List<String> url = new ArrayList<>();

        String folderPath = getFolderPath(dto);
        createFolderIfNotExist(folderPath);

        List<ProgramImage> images  = new ArrayList<>();
        int imgNo = 0;

        if ("program".equals(table) && "MORE".equals(dto.getType())) {
            imgNo = programImageDAO.getImgNo(dto.getTableId()) + 1;
        }

        // 3️⃣ 반복문 처리 (단일/다중 통합)
        for (int i = 0; i < files.size(); i++) {
            MultipartFile file = files.get(i);

            // 파일명: timestamp + 원본 이름
            long msTime = System.currentTimeMillis();
            String fileName = msTime + "_" + file.getOriginalFilename();

            // 실제 로컬 저장
            File saveFile = new File(folderPath + fileName);
            file.transferTo(saveFile);

            url.add(fileName);

            // 4️⃣ DB 처리
            if ("program".equals(table) && "MORE".equals(dto.getType())) {
                ProgramImage img = new ProgramImage();
                img.setProgramId(dto.getTableId());
                img.setFolder(folderPath);
                img.setImage(fileName);
                img.setImgNo(imgNo + i);
                images.add(img);
            }
        }

        // 5️⃣ Program 다중 이미지 DB insert
        if (!images.isEmpty()) {
            programImageDAO.insertImg(images);
        }

        return url;
    }

    private void createFolderIfNotExist(String folderPath) {
        File folder = new File(folderPath);
        if (!folder.exists()) {
            folder.mkdirs();
        }
    }

    private String getFolderPath(FileUploadDTO dto) {
        String basePath = "C:\\dia-project\\";
        if ("program".equals(dto.getTable())) {
            // Program 다중 이미지
            return String.format("%sworkshop\\%d\\program\\%d\\", basePath, dto.getWorkshopId(), dto.getTableId());
        } else {
            return String.format("%s%s\\%d\\", basePath, dto.getTable(), dto.getTableId());
        }
    }


}
