package com.project.dia.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchDTO {
    private String filter;
    private String keyword;

    private String sortBy;   // name, created_at
    private String sortDir;  // asc, desc

    private int page;
    private int size;
    private int offset;

    private boolean workshop;
    private boolean program;
}
