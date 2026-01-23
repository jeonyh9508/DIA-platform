package com.project.dia.dao;

import com.project.dia.model.vo.ProgramImage;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ProgramImageDAO {
    int getImgNo(int programId);
    void insertImg(List<ProgramImage> images);

}
