package com.project.dia.dao;

import com.project.dia.model.dto.QnaAdminDTO;
import com.project.dia.model.vo.QnaAdmin;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface QnaAdminDAO {
    int deleteQnaToAdmin(int qnaAdminId);
    int insertQnaToAdmin(QnaAdmin qnaAdmin);
    int updateQnaToAdmin(QnaAdmin qnaAdmin);
    List<QnaAdmin> qnaAdminView(int userId);
// erp 문의
    List<QnaAdminDTO> selectAllQnaAdmin(Map<String, Object> params);
    int updateQnaToCustomer(QnaAdminDTO qnaAdminDTO);
    int deleteQnaToCustomer(QnaAdminDTO qnaAdminDTO);
    int getUserIdByQnaId(int qnaAdminId);
    QnaAdmin findById(int id);

}
