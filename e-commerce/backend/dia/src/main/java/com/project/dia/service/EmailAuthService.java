package com.project.dia.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
@RequiredArgsConstructor
public class EmailAuthService {

    private final JavaMailSender javaMailSender;
    private int authNumber; // 인증코드

    public void makeRandomNumber(){
        Random rnd = new Random();

        int checkNum = rnd.nextInt( 999999 - 111111 + 1 ) + 111111;

        authNumber = checkNum;
    }

    public String joinEmail(String email) {
        makeRandomNumber();
        String setForm = "noreply@dia.com";
        String toMail = email;
        String title = "이메일 인증 안내";

        // 인증메세지에 나올 메세지
        String content = "회원님의 이메일 주소 확인을 위해 아래 인증번호를 입력해주세요. <br><br>"
                            + "인증번호: <b>" + authNumber + "</b><br><br>"
                            + "본 인증 번호는 5분간 유효합니다.<br>"
                            + "만약 본인이 요청한 것이 아니라면, 이 메일을 무시해주세요.";

        try {

            MimeMessage mail = javaMailSender.createMimeMessage();
            MimeMessageHelper mailHelper = new MimeMessageHelper( mail, true, "UTF-8" );

            mailHelper.setFrom(setForm); // 보낸 사람
            mailHelper.setTo(toMail); // 받는 사람
            mailHelper.setSubject(title); // 제목
            mailHelper.setText(content, true); // 내용 / true 필수

            javaMailSender.send(mail);

        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }

        return String.valueOf(authNumber);

    }

}
