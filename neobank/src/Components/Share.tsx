import { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Header } from "../Layers/Header";
import { Footer } from "../Layers/Footer";
import { Field } from "../Layers/Field";
import shareData from "../share_data";
import { compoundPeriodic, compoundYearly, formatTL } from "../utils/finance";
import { numberRules, optionalNumberRules } from "../utils/rules";

type Inputs = {
  alinanHisse: number;
  hisseFiyati: number;
  islemUcreti: number;
  mevcutHisse: number;
  guncelFiyat: number;
  nakit: number;
  satisFiyati: number;
  alisFiyati: number;
  satilanHisse: number;
  islemTutari: number;
  yilPara: number;
  yilOran: number;
  yil: number;
  ayPara: number;
  ayOran: number;
  donemSayisi: number;
  ay: number;
};

// Boş bırakılabilen alanlar (boşsa 0 sayılır)
const optionalFields = ["islemUcreti", "nakit", "islemTutari"];

const resultLabels: Record<string, string> = {
  maliyet: "Toplam alım maliyeti",
  deger: "Portföy değeri",
  kar: "Kar / Zarar",
  year: "Vade sonu tutarı",
  month: "Vade sonu tutarı",
};

const orZero = (v: number): number => (Number.isFinite(v) ? v : 0);

export const Share = () => {
  const navigate = useNavigate();
    const onClick = (url: string): void => {
    void navigate(url);
    };

  const { yatirimTuru, inputs } = shareData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const [selectedYatirimTuru, setSelectedYatirimTuru] = useState<string | null>(null);
  const [selectedIslem, setSelectedIslem] = useState<string | null>(null);
  const [result, setResult] = useState<number | null>(null);

  const yatirimData = selectedYatirimTuru
    ? yatirimTuru.tip[selectedYatirimTuru as keyof typeof yatirimTuru.tip]
    : undefined;
  const islemData = selectedIslem ? inputs[selectedIslem] : undefined;

  const yatirimTuruChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSelectedYatirimTuru(e.target.value);
    setSelectedIslem(null);
    setResult(null);
    reset();
  };

  const islemTuruChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSelectedIslem(e.target.value);
    setResult(null);
    reset();
  };

  const hesapla = (d: Inputs): void => {
    switch (selectedIslem) {
      case "maliyet":
        setResult(d.alinanHisse * d.hisseFiyati + orZero(d.islemUcreti));
        break;
      case "deger":
        setResult(d.mevcutHisse * d.guncelFiyat + orZero(d.nakit));
        break;
      case "kar":
        setResult((d.satisFiyati - d.alisFiyati) * d.satilanHisse - orZero(d.islemTutari));
        break;
      case "year":
        setResult(compoundYearly(d.yilPara, d.yilOran, d.yil));
        break;
      case "month":
        setResult(compoundPeriodic(d.ayPara, d.ayOran, d.donemSayisi, d.ay));
        break;
      default:
        break;
    }
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
          <div className="share-content flex flex-col items-center gap-6">
            <form
              className="w-full max-w-md flex flex-col gap-5"
              onSubmit={handleSubmit(hesapla)}
              noValidate
            >
              <fieldset className="flex flex-col gap-2">
                <legend className="mb-1 font-medium">Yatırım Türü Seçiniz:</legend>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
                  {Object.entries(yatirimTuru.tip).map(([key, tip]) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="yatirimTuru"
                        value={key}
                        checked={selectedYatirimTuru === key}
                        onChange={yatirimTuruChange}
                        className="accent-white"
                      />
                      <span>{tip.text}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className="flex flex-col gap-2">
                <legend className="mb-1 font-medium">İşlem Türünü Seçiniz:</legend>
                {!yatirimData ? (
                  <p className="text-yellow-200 text-sm">Önce yatırım türünü seçin.</p>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
                    {Object.entries(yatirimData.islemler).map(([key, step]) => (
                      <label key={key} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="islem"
                          value={key}
                          checked={selectedIslem === key}
                          onChange={islemTuruChange}
                          className="accent-white"
                        />
                        <span>{step.text}</span>
                      </label>
                    ))}
                  </div>
                )}
              </fieldset>

              {!islemData ? (
                selectedYatirimTuru && (
                  <p className="text-yellow-200 text-sm">Şimdi bir işlem türü seçin.</p>
                )
              ) : (
                Object.values(islemData).map((f) => {
                  const name = f.type as keyof Inputs;
                  const rules = optionalFields.includes(f.type)
                    ? optionalNumberRules
                    : numberRules(f.type === "donemSayisi" ? 1 : 0);

                  return (
                    <Field key={f.key} label={f.holder} htmlFor={f.type} error={errors[name]?.message}>
                      <input
                        id={f.type}
                        type="number"
                        step="any"
                        inputMode="decimal"
                        className="calc-input"
                        placeholder={f.holder}
                        {...register(name, rules)}
                      />
                    </Field>
                  );
                })
              )}

              <div className="w-full flex justify-between">
                <button className="btn-primary" type="submit" disabled={!islemData}>
                  Hesapla
                </button>
                <button className="btn-secondary" type="button" onClick={sifirla}>
                  Sıfırla
                </button>
              </div>
            </form>

            <div className="result-box" aria-live="polite">
              {result == null || !selectedIslem ? (
                <p>Henüz işlem yapılmadı!</p>
              ) : (
                <p>
                  {resultLabels[selectedIslem]}:{" "}
                  <strong
                    className={
                      selectedIslem === "kar" ? (result < 0 ? "text-red-200" : "text-green-200") : ""
                    }
                  >
                    {formatTL(result)}
                  </strong>
                </p>
              )}
            </div>
          </div>

          <div className="share-content flex flex-col gap-3">
            <h2 className="text-2xl">Hisse Senedi Yatırım Simülasyonu</h2>
            <p>
                Hisse senedi yatırım simülasyonu, sanal bir ortamda yatırım deneyimi yaşamanızı sağlar.
                Hem kısa vadeli alım-satım işlemlerini hem de uzun vadeli yatırım büyümesini
                inceleyebilirsiniz.
            </p>

            <h3 className="text-xl">1. Alım-Satım Simülasyonu</h3>
            <ul className="space-y-1">
                <li><strong>Alım Maliyeti:</strong> Alınan Hisse Miktarı × Hisse Fiyatı + İşlem Ücreti (boş bırakılabilir)</li>
                <li><strong>Portföy Değeri:</strong> (Mevcut Hisse Miktarı × Güncel Hisse Fiyatı) + Nakit (boş bırakılabilir)</li>
                <li><strong>Kar/Zarar:</strong> (Satış Fiyatı − Alış Fiyatı) × Satılan Hisse Miktarı − İşlem Ücretleri (boş bırakılabilir)</li>
            </ul>

            <h3 className="text-xl">2. Uzun Vadeli Yatırım Simülasyonu</h3>
            <p>Başlangıç tutarı, yıllık getiri oranı ve süre girilerek yatırımın büyümesi hesaplanır.</p>

            <h4 className="text-lg">Yıl ile hesap</h4>
            <p className="text-center font-semibold">
                Toplam = P × (1 + r / 100)<sup>Yıl</sup>
            </p>
            <p>
                <strong>Örnek:</strong> 10.000 TL, yıllık %10 getiri (forma <strong>10</strong> yazın), 5 yıl:
                10.000 × (1 + 10 / 100)<sup>5</sup> = 16.105,10 ₺
            </p>

            <hr className="border-white/30" />

            <h4 className="text-lg">Ay ile hesap (dönemsel)</h4>
            <p className="text-center font-semibold">
                Toplam = P × (1 + r / (100 × d))<sup>d × (t / 12)</sup>
            </p>
            <ul className="space-y-1">
                <li><strong>P:</strong> Ana para</li>
                <li><strong>r:</strong> Yıllık getiri oranı (yüzde olarak, %12 ise 12 yazılır)</li>
                <li><strong>d:</strong> Yıl içindeki dönem sayısı (aylık için 12, çeyreklik için 4)</li>
                <li><strong>t:</strong> Yatırım süresi (ay)</li>
            </ul>
            <p>
                <strong>Örnek:</strong> 10.000 TL, yıllık %12, aylık dönem (d = 12), 24 ay:
                10.000 × (1 + 12 / 1200)<sup>24</sup> = 12.697,35 ₺
            </p>
            <p className="text-sm opacity-90">Sonuçlar bilgilendirme amaçlıdır.</p>
            </div>
        </div>
      </div>
      <Footer />
    </>
  );
};