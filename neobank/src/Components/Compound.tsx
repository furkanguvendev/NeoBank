import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Header } from "../Layers/Header";
import { Footer } from "../Layers/Footer";
import { Field } from "../Layers/Field";
import { compoundMonthly, compoundYearly, formatTL } from "../utils/finance";
import { numberRules } from "../utils/rules";

type Inputs = { money: number; rate: number; time: number };
type Period = "year" | "month";
type Result = { total: number; interest: number };

export const Compound = () => {
  const navigate = useNavigate();
  const onClick = (url: string): void => {
  void navigate(url);
  };

  const [period, setPeriod] = useState<Period>("year");
  const [result, setResult] = useState<Result | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const hesapla = ({ money, rate, time }: Inputs): void => {
    const total =
      period === "year" ? compoundYearly(money, rate, time) : compoundMonthly(money, rate, time);
    setResult({ total, interest: total - money });
  };

  const changePeriod = (p: Period): void => {
    setPeriod(p);
    setResult(null); // eski sonuç yeni seçime ait değil
  };

  const sifirla = (): void => {
    reset();
    setResult(null);
    setPeriod("year");
  };

  return (
    <>
      <div className="w-full flex flex-col items-center">
        <Header onClick={onClick} />
        <div className="calc-grid">
          <div className="compound-content flex flex-col items-center gap-6">
            <form
              className="flex flex-col gap-4 w-full max-w-md"
              onSubmit={handleSubmit(hesapla)}
              noValidate
            >
              <fieldset className="flex flex-col items-center gap-2">
                <legend className="mb-1 font-medium">Süre türü</legend>
                <div className="flex gap-6">
                  {(["year", "month"] as const).map((p) => (
                    <label key={p} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="period"
                        value={p}
                        checked={period === p}
                        onChange={() => changePeriod(p)}
                        className="accent-white"
                      />
                      <span>{p === "year" ? "Yıl" : "Ay"}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <Field label="Ana Para (₺)" htmlFor="money" error={errors.money?.message}>
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

              <Field label="Yıllık Faiz Oranı (%)" htmlFor="rate" error={errors.rate?.message}>
                <input
                  id="rate"
                  type="number"
                  step="any"
                  inputMode="decimal"
                  className="calc-input"
                  placeholder="Örn: 5"
                  {...register("rate", numberRules(0))}
                />
              </Field>

              <Field
                label={period === "year" ? "Süre (Yıl)" : "Süre (Ay)"}
                htmlFor="time"
                error={errors.time?.message}
              >
                <input
                  id="time"
                  type="number"
                  step="any"
                  inputMode="decimal"
                  className="calc-input"
                  placeholder={period === "year" ? "Örn: 3" : "Örn: 36"}
                  {...register("time", numberRules(0.01))}
                />
              </Field>

              <div className="flex w-full justify-between">
                <button className="btn-primary" type="submit">Hesapla</button>
                <button className="btn-secondary" type="button" onClick={sifirla}>Sıfırla</button>
              </div>
            </form>

            <div className="result-box" aria-live="polite">
              {result ? (
                <>
                  <p>Kazanılan Faiz: <strong>{formatTL(result.interest)}</strong></p>
                  <p>Vade Sonu Toplam: <strong>{formatTL(result.total)}</strong></p>
                </>
              ) : (
                <p>Henüz işlem yapılmadı!</p>
              )}
            </div>
          </div>

          <div className="compound-content flex flex-col justify-center gap-3">
            <h2 className="text-2xl">Bileşik Faiz Nedir?</h2>
            <p>
                Bileşik faiz, anaparanın ve önceki dönemlerde kazanılan faizlerin toplamı üzerinden
                faiz hesaplanan bir sistemdir. Faizin "faiz getirmesi" prensibine dayanır ve
                birikimlerin daha hızlı büyümesini sağlar.
            </p>

            <h3 className="text-xl">Hesaplama Formülü</h3>
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-3">
                <p>
                <span>Yıl için:</span><br />
                <strong>A = P × (1 + r / 100)<sup>n</sup></strong>
                </p>
                <p>
                <span>Ay için:</span><br />
                <strong>A = P × (1 + r / 1200)<sup>n</sup></strong>
                </p>
            </div>
            <ul className="space-y-1">
                <li><strong>A:</strong> Vade sonu toplam değer (ana para + faiz)</li>
                <li><strong>P:</strong> Başlangıçtaki ana para</li>
                <li><strong>r:</strong> Yıllık faiz oranı (yüzde olarak, %5 ise 5 yazılır)</li>
                <li><strong>n:</strong> Süre (yıl modunda yıl, ay modunda ay sayısı)</li>
            </ul>
            <p className="text-sm opacity-90">
                Ay modunda yıllık oran 12'ye bölünür (r / 12 / 100 = r / 1200) ve her ay faiz işletilir.
            </p>

            <h3 className="text-xl">Örnekler</h3>
            <p>10.000 TL, yıllık %5 faiz (forma <strong>5</strong> yazın), 3 yıl:</p>
            <p className="font-semibold">
                A = 10.000 × (1 + 5 / 100)<sup>3</sup> = 11.576,25 TL (faiz: 1.576,25 TL)
            </p>
            <p>10.000 TL, yıllık %12 faiz, 24 ay (Ay modu):</p>
            <p className="font-semibold">
                A = 10.000 × (1 + 12 / 1200)<sup>24</sup> = 12.697,35 TL (faiz: 2.697,35 TL)
            </p>
            </div>
        </div>
      </div>
      <Footer />
    </>
  );
};