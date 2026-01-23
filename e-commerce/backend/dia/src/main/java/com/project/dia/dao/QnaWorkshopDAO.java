package com.project.dia.dao;

import com.project.dia.model.dto.QnaWorkshopDTO;
import com.project.dia.model.vo.QnaWorkshop;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface QnaWorkshopDAO {
    List<QnaWorkshopDTO> selectAll(int programId);
    QnaWorkshopDTO selectOne(int qnaId);
    int selectAllCount(int programId);
    List<QnaWorkshopDTO> selectMyQna(int userId);
    List<QnaWorkshopDTO> qnaWorkshop (int workshopId);
    int qnaWsAnswer(QnaWorkshop workshop);
    int insertQna(QnaWorkshop workshop);
    int deleteQna(int qnaId);

}
