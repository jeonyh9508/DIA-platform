package com.project.dia.dao;

import com.project.dia.model.dto.FollowDTO;
import com.project.dia.model.vo.Follow;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface FollowDAO {

    List<FollowDTO> selectFollow(int userId);
    List<FollowDTO> followList(int workshopId);
    int selectTotalFollows(int workshopId);
    Follow selectOne(Follow follow);
    int insertFollow(Follow follow);
    int updateFollow(int followId, boolean active);
    List<Integer> selectFollowedWorkshopIds(int userId);
    List<Map<String, Object>> workshopTag();


}
