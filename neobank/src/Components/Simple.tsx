import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Header } from "../Layers/Header";
import { Footer } from "../Layers/Footer";
import { Field } from "../Layers/Field";
import { formatTL, simpleInterest } from "../utils/finance";
import { numberRules } from "../utils/rules";

type Inputs = { money: number; rate: number; time: number };
type Result = { interest: number; total: number };

export const Simple = () => {
  const navigate = useNavigate();
  const onClick = (url: string): void => {
    void navigate(url);
  };
  const [result, setResult] = useState<Result | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const hesapla = ({ money, rate, time }: Inputs): void => {
    const interest = simpleInterest(money, rate, time);
    setResult({ interest, total: money + interest });
  };

  const sifirla = (): void => {
    reset();
    setResult(null);
  };

  return (
    <>
      <div className="w-full flex flex-col items-center">
        <Header onClick={onClick} />
        <div className="calc-grid">
          <div className="simple-content flex flex-col items-center gap-6">
            <form
              className="flex flex-col gap-4 w-full max-w-md"
              onSubmit={handleSubmit(hesapla)}
              noValidate
            >
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

              <Field label="Süre (Yıl)" htmlFor="time" error={errors.time?.message}>
                <input
                  id="time"
                  type="number"
                  step="any"
                  inputMode="decimal"
                  className="calc-input"
                  placeholder="Örn: 3"
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
                  <p>Faiz Tutarı: <strong>{formatTL(result.interest)}</strong></p>
                  <p>Vade Sonu Toplam: <strong>{formatTL(result.total)}</strong></p>
                </>
              ) : (
                <p>Henüz işlem yapılmadı!</p>
              )}
            </div>
          </div>

          <div className="simple-content flex flex-col justify-center gap-3">
            <h2 className="text-2xl">Basit Faiz Nedir?</h2>
            <p>
              Basit faiz, bir ana para üzerinden belirli bir süre ve faiz oranı ile kazanç veya borç
              maliyetinin hesaplanması yöntemidir. Faiz her dönem yalnızca ana para üzerinden işler.
            </p>

            <h3 className="text-xl">Hesaplama Formülü</h3>
            <p className="text-lg font-semibold text-center">F = A × (r / 100) × t</p>
            <ul className="space-y-1">
              <li><strong>F:</strong> Hesaplanan faiz miktarı</li>
              <li><strong>A:</strong> Ana para (başlangıçtaki miktar)</li>
              <li><strong>r:</strong> Yıllık faiz oranı (yüzde olarak, %5 ise 5 yazılır)</li>
              <li><strong>t:</strong> Süre (yıl)</li>
            </ul>

            <h3 className="text-xl">Örnek</h3>
            <p>10.000 TL, yıllık %5 faiz (forma <strong>5</strong> yazın), 3 yıl:</p>
            <p><em>F = 10.000 × (5 / 100) × 3 = 1.500 TL</em></p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};