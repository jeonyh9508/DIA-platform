package com.project.dia.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PagingDTO<T> {

    private List<T> content;       // 현재 페이지 데이터
    private int page;              // 현재 페이지
    private int size;              // 페이지당 개수
    private long totalElements;    // 전체 데이터 개수
    private int totalPages;        // 전체 페이지 수

    public PagingDTO(List<T> content, long totalElements, int page, int size) {
        this.content = content;
        this.totalElements = totalElements;
        this.page = page;
        this.size = size;
        this.totalPages = (int) Math.ceil((double) totalElements / size);
    }

}
