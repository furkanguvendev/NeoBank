import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Header } from "../Layers/Header";
import { Footer } from "../Layers/Footer";
import { Field } from "../Layers/Field";
import {
  annuityPayment,
  decliningSchedule,
  formatNumber,
  formatTL,
  type ScheduleRow,
} from "../utils/finance";
import { numberRules } from "../utils/rules";

type Inputs = { money: number; rate: number; time: number };
type Kind = "sabit" | "azalan";

type Result =
  | { kind: "sabit"; payment: number; totalPayment: number; totalInterest: number }
  | { kind: "azalan"; rows: ScheduleRow[]; totalPayment: number; totalInterest: number };

export const Credit = () => {
  const navigate = useNavigate();
  const onClick = (url: string): void => {
  void navigate(url);
  };

  const [kind, setKind] = useState<Kind>("sabit");
  const [result, setResult] = useState<Result | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const hesapla = ({ money, rate, time }: Inputs): void => {
    if (kind === "sabit") {
      const payment = annuityPayment(money, rate, time);
      const totalPayment = payment * time;
      setResult({ kind, payment, totalPayment, totalInterest: totalPayment - money });
    } else {
      const rows = decliningSchedule(money, rate, time);
      const totalPayment = rows.reduce((sum, r) => sum + r.payment, 0);
      setResult({ kind, rows, totalPayment, totalInterest: totalPayment - money });
    }
  };

  const changeKind = (k: Kind): void => {
    setKind(k);
    setResult(null);
  };

  const sifirla = (): void => {
    reset();
    setResult(null);
    setKind("sabit");
  };

  return (
    <>
      <div className="w-full flex flex-col items-center">
        <Header onClick={onClick} />
        <div className="calc-grid">
          <div className="credit-content flex flex-col items-center gap-6">
            <form
              className="flex flex-col gap-4 w-full max-w-md"
              onSubmit={handleSubmit(hesapla)}
              noValidate
            >
              <fieldset className="flex flex-col items-center gap-2">
                <legend className="mb-1 font-medium text-lg">Faiz tipi seçiniz:</legend>
                <div className="flex gap-6">
                  {(
                    [
                      ["sabit", "Sabit Faiz"],
                      ["azalan", "Azalan Faiz"],
                    ] as const
                  ).map(([value, text]) => (
                    <label key={value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="kind"
                        value={value}
                        checked={kind === value}
                        onChange={() => changeKind(value)}
                        className="accent-white"
                      />
                      <span>{text}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <Field label="Kredi Tutarı (₺)" htmlFor="money" error={errors.money?.message}>
                <input
                  id="money"
                  type="number"
                  step="any"
                  inputMode="decimal"
                  className="calc-input"
                  placeholder="Örn: 10000"
                  {...register("money", numberRules(0.01))}
                />
              </Field>

              <Field label="Aylık Faiz Oranı (%)" htmlFor="rate" error={errors.rate?.message}>
                <input
                  id="rate"
                  type="number"
                  step="any"
                  inputMode="decimal"
                  className="calc-input"
                  placeholder="Örn: 1.5"
                  {...register("rate", numberRules(0))}
                />
              </Field>

              <Field label="Vade (Ay)" htmlFor="time" error={errors.time?.message}>
                <input
                  id="time"
                  type="number"
                  step="1"
                  inputMode="numeric"
                  className="calc-input"
                  placeholder="Örn: 12"
                  {...register("time", {
                    ...numberRules(1),
                    validate: (v) => Number.isInteger(v) || "Tam sayı giriniz!",
                  })}
                />
              </Field>

              <div className="flex w-full justify-between">
                <button className="btn-primary" type="submit">Hesapla</button>
                <button className="btn-secondary" type="button" onClick={sifirla}>Sıfırla</button>
              </div>
            </form>

            <div className="result-box" aria-live="polite">
              {!result ? (
                <p>Henüz işlem yapılmadı!</p>
              ) : (
                <>
                  {result.kind === "sabit" && (
                    <p>Aylık Taksit: <strong>{formatTL(result.payment)}</strong></p>
                  )}
                  <p>Toplam Geri Ödeme: <strong>{formatTL(result.totalPayment)}</strong></p>
                  <p>Toplam Faiz: <strong>{formatTL(result.totalInterest)}</strong></p>
                </>
              )}
            </div>

            {result?.kind === "azalan" && (
              <div className="w-full max-h-80 overflow-auto rounded-lg bg-white/10">
                <table className="w-full text-sm text-right">
                  <thead className="sticky top-0 bg-blue-950">
                    <tr>
                      <th className="p-2 text-left">Ay</th>
                      <th className="p-2">Taksit</th>
                      <th className="p-2">Faiz</th>
                      <th className="p-2">Anapara</th>
                      <th className="p-2">Kalan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((r) => (
                      <tr key={r.month} className="border-t border-white/10">
                        <td className="p-2 text-left">{r.month}</td>
                        <td className="p-2">{formatNumber(r.payment)}</td>
                        <td className="p-2">{formatNumber(r.interest)}</td>
                        <td className="p-2">{formatNumber(r.principal)}</td>
                        <td className="p-2">{formatNumber(r.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="credit-content flex flex-col gap-3">
            <h2 className="text-2xl">Kredi Hesaplama Nedir?</h2>
            <p>
              Kredi hesaplama, alınan kredinin faiz oranı ve geri ödeme süresine göre aylık
              taksitlerin belirlenmesidir. İki temel yöntem kullanılır:
            </p>

            <h3 className="text-xl">1. Sabit (Eşit) Taksitli Kredi</h3>
            <p>Her ay eşit miktarda ödeme yapılır.</p>
            <h4 className="text-lg">Formül</h4>
            <div className="flex justify-center items-center py-3 overflow-x-auto">
              <p className="pr-2">Taksit =</p>
              <div className="flex flex-col items-center">
                <p className="border-b-2 px-1">A × i × (1 + i)<sup>n</sup></p>
                <p className="pt-1">(1 + i)<sup>n</sup> − 1</p>
              </div>
            </div>
            <ul className="space-y-1">
              <li><strong>A:</strong> Alınan kredi miktarı</li>
              <li><strong>i:</strong> Aylık faiz oranı, ondalık hali (i = FO / 100)</li>
              <li><strong>FO:</strong> Formda yazdığınız aylık faiz oranı (yüzde olarak, %1,5 ise 1.5)</li>
              <li><strong>n:</strong> Vade (ay)</li>
            </ul>
            <p className="text-sm opacity-90">
              Yıllık oranı biliyorsanız 12'ye bölerek aylık orana çevirin.
            </p>
            <h4 className="text-lg">Örnek</h4>
            <p>10.000 TL kredi, aylık %1,5 faiz (forma <strong>1.5</strong> yazın), 12 ay vade:</p>
            <p>i = 1,5 / 100 = 0,015</p>
            <p className="font-semibold">
              Taksit ≈ 916,80 ₺ (toplam geri ödeme ≈ 11.001,60 ₺, toplam faiz ≈ 1.001,60 ₺)
            </p>

            <h3 className="text-xl">2. Azalan Bakiyeli Kredi</h3>
            <p>
              Anapara her ay eşit bölünür, faiz kalan anapara üzerinden hesaplanır. İlk taksitler
              yüksek, sonrakiler düşük olur.
            </p>
            <ul className="space-y-1">
              <li><strong>Anapara payı:</strong> A / n</li>
              <li><strong>Faiz:</strong> Kalan anapara × (FO / 100)</li>
              <li><strong>Taksit:</strong> Anapara payı + Faiz</li>
            </ul>
            <h4 className="text-lg">Örnek</h4>
            <p>10.000 TL kredi, aylık %1,5 faiz, 12 ay vade:</p>
            <ul className="space-y-1">
              <li><strong>1. ay:</strong> Faiz 10.000 × 0,015 = 150 ₺, anapara payı 10.000 / 12 = 833,33 ₺, taksit 983,33 ₺</li>
              <li><strong>12. ay:</strong> Faiz 833,33 × 0,015 = 12,50 ₺, taksit 845,83 ₺</li>
              <li><strong>Toplam faiz:</strong> 975 ₺ (sabit taksitte 1.001,60 ₺)</li>
            </ul>
            <p className="text-sm opacity-90">
              Gerçek kredilerde bazı türlerde vergi (KKDF/BSMV) ve masraflar eklenebilir; sonuçlar
              bilgilendirme amaçlıdır.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};