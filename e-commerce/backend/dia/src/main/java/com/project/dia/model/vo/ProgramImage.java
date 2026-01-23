package com.project.dia.model.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgramImage {
    private Integer programImageId;
    private Integer programId;
    private String folder;      // 예: "workshop/456/program/123/"
    private String image;       // 예: "image_0.jpg"
    private Integer imgNo;     // 예: 0, 1, 2...
}
