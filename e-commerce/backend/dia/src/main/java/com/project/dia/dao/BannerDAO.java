package com.project.dia.dao;

import com.project.dia.model.vo.Banner;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BannerDAO {
    List<Banner> selectAllBanners();
    int insertBanner(Banner banner);
    int updateBanner(Banner banner);
    int deleteBanner(int bannerId);
    int updateSortOrder(@Param("bannerId") int bannerId, @Param("sortOrder") int sortOrder);
    Banner selectOneBanner(int bannerId);
    int updateBannerActive(@Param("bannerId") int bannerId,
                           @Param("active") boolean active);
}
