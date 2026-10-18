import { Content } from "../Layers/Content";
import { Footer } from "../Layers/Footer";
import { Header } from "../Layers/Header";
import Slider from "../Layers/Slider";
import { useNavigate } from "react-router-dom";
import { MdNotificationImportant } from "react-icons/md";

export const Home = () => {
  const navigate = useNavigate();
  const onClick = (url: string): void => {
  void navigate(url);
  };

  return (
    <>
      <div className="w-full flex flex-col items-center">
        <Header onClick={onClick} />
        <Slider />
        <p className="flex items-start gap-2 mt-5 mx-4 max-w-2xl rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <MdNotificationImportant className="text-xl shrink-0 mt-0.5" />
          <span>
            Bu araçlardaki sonuçlar bilgilendirme amaçlıdır. Bankaların gösterdiği rakamlar vergi ve
            masraflar nedeniyle farklı olabilir.
          </span>
        </p>
        <Content onClick={onClick} />
      </div>
      <Footer />
    </>
  );
};