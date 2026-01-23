package com.project.dia.service;

import com.project.dia.config.security.PrincipalDetails;
import com.project.dia.dao.UserDAO;
import com.project.dia.dao.AdminRoleDAO;
import com.project.dia.model.dto.FileUploadDTO;
import com.project.dia.model.vo.AdminRole;
import com.project.dia.model.vo.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
    private final UserDAO userDAO;
    private final FileUploadService fileUploadService;
    private final PasswordEncoder passwordEncoder;
    private final AdminRoleDAO adminRoleDAO;

    public User selectOne(int id) {
        return userDAO.selectOne(id);
    }

    public int modifyUser(User vo) {
        return userDAO.modifyUser(vo);
    }

    public String  modiProfileUser(User vo, MultipartFile file) {
        userDAO.modifyUser(vo); // 텍스트 정보(이름, 연락처 등) 먼저 수정

        String savedFileName = null; // 2. 리턴할 파일명을 담을 변수 선언

        if (file != null && !file.isEmpty()) {
            FileUploadDTO dto = new FileUploadDTO();
            dto.setTable("user");
            dto.setTableId(vo.getUserId());
            dto.setType("ONE");
            dto.setColName("profile_img");

            try {
                // 3. 업로드 후 생성된 '진짜 파일명(숫자_이름.jpg)'을 변수에 저장
                savedFileName = fileUploadService.uploadFiles(dto, List.of(file)).get(0);

                vo.setProfileImg(savedFileName);
                userDAO.profileUser(vo); // DB에 이미지 이름 업데이트

            } catch (IOException e) {
                throw new RuntimeException("워크샵 이미지 업로드 실패", e);
            }
        } else {
            userDAO.profileUser(vo);
            savedFileName = vo.getProfileImg(); // 리턴값 세팅
        }

        // 4. 저장된 파일명 리턴 (이미지 변경 안 했으면 null 리턴됨)
        return savedFileName;
    }

    public void quitUser(int userId) { userDAO.quitUser(userId); }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 1. 기본 유저 정보 조회
        User user = userDAO.userEmail(email);

        if (user == null) {
            throw new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + email);
        }

        // 2. 권한(Role) 처리 로직
        List<GrantedAuthority> authorities = new ArrayList<>();

        if ("ADMIN".equals( user.getRole() )) {
            List<AdminRole> adminRoles = (List<AdminRole>) adminRoleDAO.findByUserId(user.getUserId());

            if (adminRoles != null) {
                for (AdminRole role : adminRoles) {
                    // DB의 'SUPER' -> 'ROLE_SUPER'로 변환하여 추가
                    authorities.add(new SimpleGrantedAuthority( "ROLE_" + role.getRoleName() ));
                }
            }

            authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
        } else {
            authorities.add(new SimpleGrantedAuthority( "ROLE_" + user.getRole() ));
        }

        return new PrincipalDetails(user, authorities);
    }

    public void registerUser(User vo) {
        if (userDAO.userEmail(vo.getEmail()) != null) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        String encodePassword = passwordEncoder.encode(vo.getPassword());
        vo.setPassword(encodePassword);

        userDAO.registerUser(vo);
    }

    public User userEmail(String email) {
        User user = userDAO.userEmail(email);
        return user;
    }

    public int changePwd(User vo) {
        User user = userDAO.userEmail(vo.getEmail());

        if(user != null) {
            String encodedPwd = passwordEncoder.encode(vo.getPassword());
            vo.setPassword(encodedPwd);
            int res = userDAO.changePwd(vo);
            return res;
        } else {
            throw new UsernameNotFoundException("가입되지 않은 이메일입니다.");
        }
    }

}
