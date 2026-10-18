import { useState } from "react";
import { Link } from "react-router-dom";
import { FaLinkedin } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { BiLogoGmail } from "react-icons/bi";

export const Footer = () => {
  const [showTerms, setShowTerms] = useState<boolean>(false);

  return (
    <footer className="w-[92%] max-w-6xl flex flex-row justify-between items-center my-10">
      <nav className="flex flex-col gap-4">
        <Link to="/aboutme" className="hover:underline">Hakkımda</Link>
        <button type="button" className="text-left hover:underline" onClick={() => setShowTerms(true)}>
          Kullanım Şartları
        </button>
      </nav>

      <nav className="flex flex-row gap-6 text-3xl">
        <a href="https://www.linkedin.com/in/devfurkang/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
          <FaLinkedin />
        </a>
        <a href="https://furkan-guven.vercel.app/" target="_blank" rel="noreferrer" aria-label="Portfolyo">
          <CgProfile />
        </a>
        <a href="mailto:furkanguven.dev@gmail.com" aria-label="E-posta">
          <BiLogoGmail />
        </a>
      </nav>

      {showTerms && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowTerms(false)}
        >
          <div
            className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white text-gray-800 p-6 rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-4">
              Yapacağınız hesaplamalar ve verdiğim bilgiler, araştırmam doğrultusunda elde ettiğim
              verilere dayanmaktadır. Ancak sağlanan bilgilerin kesin doğruluğunu garanti
              edememekteyim.
            </p>
            <p className="mb-4">
              Lütfen önemli kararlar almadan önce bu bilgileri doğrulamayı ihmal etmeyiniz. Bu
              bilgilerden kaynaklanabilecek herhangi bir hata, eksiklik veya yanlış anlaşılma
              durumunda sorumluluk kabul etmediğimi belirtmek isterim.
            </p>
            <button
              type="button"
              onClick={() => setShowTerms(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};