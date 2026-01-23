package com.project.dia.dao;

import com.project.dia.model.dto.ApprovalDTO;
import com.project.dia.model.dto.ProgramDTO;
import com.project.dia.model.dto.SearchDTO;
import com.project.dia.model.vo.Program;
import com.project.dia.model.vo.ProgramImage;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ProgramDAO {
    List<ProgramDTO> selectAll();
    Program selectOne(int programId);
    ProgramDTO selectProgramInfo(int programId);
    List<ProgramDTO> selectPrograms(int workshopId);
    List<String> categoryAll(); // 모든 카테고리
    List<ProgramDTO> programSearch(ProgramDTO dto); // 프로그램 검색 및 조회

    List<ProgramDTO> selectCP(int userId); // 내가 수강한 프로그램들

    int programAdd(Program program);
    void programThumb(Program program);
    void programModi(Program program);
    void programActive(Program program);
    List<ProgramImage> programImages(int programId);

    int updateProgramApproved(ApprovalDTO approval);
    List<ProgramDTO> selectProgramList(SearchDTO search);
    int countProgramList(SearchDTO search);
    ProgramDTO selectProgramDetail(int programId);

    ProgramDTO programReject(int programId);
}
