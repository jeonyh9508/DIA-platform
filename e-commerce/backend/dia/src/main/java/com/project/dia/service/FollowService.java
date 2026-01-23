package com.project.dia.service;

import com.project.dia.dao.FollowDAO;
import com.project.dia.dao.ProgramDAO;
import com.project.dia.model.dto.FollowDTO;
import com.project.dia.model.dto.ProgramDTO;
import com.project.dia.model.vo.Follow;
import com.project.dia.model.vo.Program;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class FollowService implements FollowDAO {

    @Autowired
    private FollowDAO followDAO;

    @Override
    public List<FollowDTO> selectFollow(int userId) {
        return followDAO.selectFollow(userId);
    }

    @Override
    public List<FollowDTO> followList(int workshopId) {
        return followDAO.followList(workshopId);
    }

    @Override
    public int selectTotalFollows(int workshopId) {
        return followDAO.selectTotalFollows(workshopId);
    }

    @Override
    public Follow selectOne(Follow follow) {
        return followDAO.selectOne(follow);
    }

    @Override
    public int insertFollow(Follow follow) {
        return followDAO.insertFollow(follow);
    }

    @Override
    public int updateFollow(int followId, boolean active) {
        return followDAO.updateFollow(followId, active);
    }



    public List<Integer> selectFollowedWorkshopIds(int userId) {
        return followDAO.selectFollowedWorkshopIds(userId);
    }


    public List<Map<String, Object>> workshopTag() {
        return followDAO.workshopTag();
    }


}
