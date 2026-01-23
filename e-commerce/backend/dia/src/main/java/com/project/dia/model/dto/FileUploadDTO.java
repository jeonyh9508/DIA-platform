package com.project.dia.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FileUploadDTO {
    private String table;
    private Integer tableId;
    private String type;
    private String colName;
    private Integer workshopId;
}
