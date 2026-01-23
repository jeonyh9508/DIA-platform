package com.project.dia.dao;

import com.project.dia.model.dto.AdminNoticeDTO;
import com.project.dia.model.vo.AdminNotice;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface AdminNoticeDAO {
    List<AdminNoticeDTO> noticeAll();
    AdminNoticeDTO noticeOne(int adminNoticeId);
    int noticeAdd(AdminNotice adminNotice);
    int noticeModi(AdminNotice adminNotice);
    int noticeDel(int adminNoticeId);
}
