package com.project.dia.service;

import com.project.dia.dao.BannerDAO;
import com.project.dia.model.vo.Banner;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BannerService {
    private final BannerDAO bannerDAO;

    public List<Banner> getAll() {
        return bannerDAO.selectAllBanners();
    }

    public void addBanner(Banner banner) {
        bannerDAO.insertBanner(banner);
    }

    public void updateBanner(Banner banner) {
        bannerDAO.updateBanner(banner);
    }

    public void deleteBanner(int id) {
        bannerDAO.deleteBanner(id);
    }

    public void updateOrder(int bannerId, int sortOrder) {
        bannerDAO.updateSortOrder(bannerId, sortOrder);
    }

    public Banner getOne(int bannerId) {
        return bannerDAO.selectOneBanner(bannerId);
    }

    public int updateActive(int bannerId, boolean active){
        return bannerDAO.updateBannerActive(bannerId, active);
    }

}
