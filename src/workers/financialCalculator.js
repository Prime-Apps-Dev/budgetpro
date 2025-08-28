// src/workers/financialCalculator.js

self.onmessage = function(e) {
  const { type, amount, interestRate, term, depositType, capitalization, loanPaymentType } = e.data;

  const P = parseFloat(amount);
  const r = parseFloat(interestRate);
  const nMonths = parseFloat(term);

  if (isNaN(P) || isNaN(r) || isNaN(nMonths) || P <= 0 || r < 0 || nMonths <= 0) {
    self.postMessage({ result: null });
    return;
  }

  const rMonthly = r / 100 / 12;

  let monthlyPayment = null;
  let totalPayment = 0;
  let totalInterest = 0;
  let paymentSchedule = [];

  if (type === 'loan') {
    if (loanPaymentType === 'annuity') {
      if (rMonthly > 0) {
        const annuityCoefficient = (rMonthly * Math.pow(1 + rMonthly, nMonths)) / (Math.pow(1 + rMonthly, nMonths) - 1);
        monthlyPayment = P * annuityCoefficient;
      } else {
        monthlyPayment = P / nMonths;
      }
      totalPayment = monthlyPayment * nMonths;
      totalInterest = totalPayment - P;

      let remainingBalance = P;
      for (let i = 1; i <= nMonths; i++) {
        const interestPayment = remainingBalance * rMonthly;
        const principalPayment = monthlyPayment - interestPayment;
        remainingBalance -= principalPayment;
        paymentSchedule.push({
          month: i,
          monthlyPayment: monthlyPayment,
          principal: principalPayment,
          interest: interestPayment,
          remainingBalance: remainingBalance > 0 ? remainingBalance : 0,
          date: new Date(new Date().setMonth(new Date().getMonth() + i - 1)).toISOString().split('T')[0]
        });
      }
    } else if (loanPaymentType === 'differentiated') {
      const principalPayment = P / nMonths;
      let remainingBalance = P;

      for (let i = 1; i <= nMonths; i++) {
        const interestPayment = remainingBalance * rMonthly;
        const monthlyPaymentCurrent = principalPayment + interestPayment;
        totalPayment += monthlyPaymentCurrent;
        remainingBalance -= principalPayment;

        paymentSchedule.push({
          month: i,
          monthlyPayment: monthlyPaymentCurrent,
          principal: principalPayment,
          interest: interestPayment,
          remainingBalance: remainingBalance > 0 ? remainingBalance : 0,
          date: new Date(new Date().setMonth(new Date().getMonth() + i - 1)).toISOString().split('T')[0]
        });
      }
      monthlyPayment = paymentSchedule[0].monthlyPayment;
      totalInterest = totalPayment - P;
    }
  } else {
    const N = r / 100;
    let Dv = 0;

    if (depositType === 'simple') {
      const T_days = nMonths * (365 / 12);
      const K_days = 365;
      const S = (P * r * T_days / K_days) / 100;
      totalPayment = P + S;
      totalInterest = S;
    } else {
      if (capitalization === 'daily') {
        const T_days = nMonths * (365 / 12);
        const K_days = 365;
        Dv = P * Math.pow(1 + (N / K_days), T_days);
      } else if (capitalization === 'monthly') {
        const T_months = nMonths;
        Dv = P * Math.pow(1 + (N / 12), T_months);
      } else if (capitalization === 'quarterly') {
        const T_quarters = nMonths / 3;
        Dv = P * Math.pow(1 + (N / 4), T_quarters);
      }
      totalPayment = Dv;
      totalInterest = Dv - P;
    }
  }

  self.postMessage({
    result: {
      monthlyPayment,
      totalPayment,
      totalInterest,
      paymentSchedule,
    }
  });
};