package com.project.dia.dao;

import com.project.dia.model.dto.NotificationUserDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface NotificationUserDAO {

    List<NotificationUserDTO> selectMyN(
            @Param("userId") int userId,
            @Param("size") int size,
            @Param("offset") int offset,
            @Param("filter") String filter
    );

    // 페이징 전체 개수
    int selectMyNCount(
            @Param("userId") int userId,
            @Param("filter") String filter
    );

    NotificationUserDTO selectOne(int id);
    List<NotificationUserDTO> selectNotis(int userId);
    int updateViewedOne(int id);
    int updateViewedList(List<Integer> ids);
    int deleteNotifications(List<Integer> ids);

}
