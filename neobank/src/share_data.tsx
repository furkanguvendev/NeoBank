interface ShareData {
  yatirimTuru: {
    tip: {
      alsat: {
        type: string;
        text: string;
        islemler: {
          maliyet: {
            isim:string;
            text:string;
          };
          deger: {
            isim:string;
            text:string;
          };
          kar: {
            isim:string;
            text:string;
          };
        };
      };
      vadeli: {
        type: string;
        text: string;
        islemler: {
          year: {
            isim:string;
            text:string;
          };
          month: {
            isim:string;
            text:string;
          };
        };
      };
    };
  };
  inputs: {
    [key: string]: {
      [key: string]: {
        key: string;
        type: string;
        holder: string;
      };
    };
  };
}

  const shareData: ShareData = {
    yatirimTuru: {
      tip: {
        alsat: {
          type:"alsat",
          text:"Alım - Satım Simülasyonu",
          islemler: {
            maliyet: {
              isim:"maliyet",
              text:"Alım Maliyeti Hesabı"
            },
            deger: {
              isim:"deger",
              text:"Portföy Değer Hesabı"
            },
            kar: {
              isim:"kar",
              text:"Kar/Zarar Hesabı"
            }
          }
        },
        vadeli: {
          type:"vadeli",
          text:"Uzun Vadeli Yatırım Simülasyonu",
          islemler: {
            year: {
              isim:"year",
              text:"Yıl İle Hesap"
            },
            month: {
              isim:"month",
              text:"Ay İle Hesap"
            }
          }
        }
      }
    },
    inputs:{
      maliyet: {
      input1: {
        key: "maliyet_input1",
        type: "alinanHisse",
        holder: "Alınan hisse miktarı",
      },
      input2: {
        key: "maliyet_input2",
        type: "hisseFiyati",
        holder: "Hisse fiyatı",
      },
      input3: {
        key: "maliyet_input3",
        type: "islemUcreti",
        holder: "İşlem ücreti (boş bırakılabilir)",
      },
    },
    deger: {
      input1: {
        key: "deger_input1",
        type: "mevcutHisse",
        holder: "Mevcut hisse miktarı",
      },
      input2: {
        key: "deger_input2",
        type: "guncelFiyat",
        holder: "Güncel hisse fiyatı",
      },
      input3: {
        key: "deger_input3",
        type: "nakit",
        holder: "Nakit (boş bırakılabilir)",
      },
    },
    kar: {
      input1: {
        key: "kar_input1",
        type: "satisFiyati",
        holder: "Satış fiyatı",
      },
      input2: {
        key: "kar_input2",
        type: "alisFiyati",
        holder: "Alış fiyatı",
      },
      input3: {
        key: "kar_input3",
        type: "satilanHisse",
        holder: "Satılan hisse miktarı",
      },
      input4: {
        key: "kar_input4",
        type: "islemTutari",
        holder: "İşlem ücretleri (boş bırakılabilir)",
      },
    },
    year: {
      input1: {
        key: "year_input1",
        type: "yilPara",
        holder: "Ana para",
      },
      input2: {
        key: "year_input2",
        type: "yilOran",
        holder: "Getiri oranı (r)",
      },
      input3: {
        key: "year_input3",
        type: "yil",
        holder: "Yatırım süresi (Yıl)",
      },
    },
    month: {
      input1: {
        key: "month_input1",
        type: "ayPara",
        holder: "Ana para",
      },
      input2: {
        key: "month_input2",
        type: "ayOran",
        holder: "Getiri oranı (r)",
      },
      input3: {
        key: "month_input3",
        type: "donemSayisi",
        holder: "Dönem sayısı (d)",
      },
      input4: {
        key: "month_input4",
        type: "ay",
        holder: "Yatırım süresi (t)",
      },
    }}
  };
  
  export default shareData;
  