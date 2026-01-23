package com.project.dia.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChartDTO {
    // daily traffic
    private String date;
    private int count;

    // hot workshop
    private int workshopId;
    private String workshopName;
    private int visitWorkshopCount;
    private double workshopAverageRating;
}
