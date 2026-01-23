package com.project.dia.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApprovalDTO {
    private String approved;
    private boolean active;
    private int targetId;
    private int adminId;
    private String actionType;
    private String reason;
}
