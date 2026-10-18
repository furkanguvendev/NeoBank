export const formatNumber = (v: number): string =>
  v.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const formatTL = (v: number): string => `${formatNumber(v)} ₺`;

const pct = (p: number): number => p / 100;

export const simpleInterest = (principal: number, ratePct: number, years: number): number =>
  principal * pct(ratePct) * years;

export const compoundYearly = (principal: number, ratePct: number, years: number): number =>
  principal * Math.pow(1 + pct(ratePct), years);

export const compoundMonthly = (principal: number, annualRatePct: number, months: number): number =>
  principal * Math.pow(1 + pct(annualRatePct) / 12, months);

export const compoundPeriodic = (
  principal: number,
  annualRatePct: number,
  periodsPerYear: number,
  months: number
): number =>
  principal * Math.pow(1 + pct(annualRatePct) / periodsPerYear, periodsPerYear * (months / 12));

export const annuityPayment = (principal: number, monthlyRatePct: number, months: number): number => {
  const r = pct(monthlyRatePct);
  if (r === 0) return principal / months;
  const factor = Math.pow(1 + r, months);
  return (principal * r * factor) / (factor - 1);
};

export type ScheduleRow = {
  month: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
};

export const decliningSchedule = (
  principal: number,
  monthlyRatePct: number,
  months: number
): ScheduleRow[] => {
  const r = pct(monthlyRatePct);
  const principalPart = principal / months;
  let balance = principal;
  const rows: ScheduleRow[] = [];

  for (let month = 1; month <= months; month++) {
    const interest = balance * r;
    balance -= principalPart;
    rows.push({
      month,
      payment: interest + principalPart,
      interest,
      principal: principalPart,
      balance: Math.max(balance, 0),
    });
  }
  return rows;
};