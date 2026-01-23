package com.project.dia.service;

import com.project.dia.dao.PaymentDAO;
import com.project.dia.model.vo.Payment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PaymentService implements PaymentDAO {

    @Autowired
    private PaymentDAO paymentDAO;

    @Override
    public int insertPayment(Payment payment) {
        return paymentDAO.insertPayment(payment);
    }

    @Override
    public int updatePaymentStatus(Payment payment) {
        return paymentDAO.updatePaymentStatus(payment);
    }

    @Override
    public Payment selectOne(int paymentId) {
        return paymentDAO.selectOne(paymentId);
    }

    @Override
    public int checkPaymentStatus(int reservationId) {
        return paymentDAO.checkPaymentStatus(reservationId);
    }

    public void updatePaymentStatus(int reservationId, String status) {
        Payment payment = new Payment();
        payment.setReservationId(reservationId);
        payment.setStatus(status);
        paymentDAO.updatePaymentStatus(payment);
    }

}
