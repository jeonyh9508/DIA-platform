package com.project.dia.dao;

import com.project.dia.model.vo.Payment;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PaymentDAO {

    int insertPayment(Payment payment);
    int updatePaymentStatus(Payment payment);
    Payment selectOne(int paymentId);
    int checkPaymentStatus(int reservationId);

}
