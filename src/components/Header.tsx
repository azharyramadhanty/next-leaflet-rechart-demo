import { useEffect, useState } from "react";
import SlidingTabBar from "./SlidingTabBar";
import { useTitle } from "@/context/TitleContext";
import { useRouter } from "next/router";
import { getOS } from "@/utils/Utils";

interface HeaderProps {
  onTabChange?: (activeIdx: number) => void;
}

const Header: React.FC<HeaderProps> = ({ onTabChange }) => {
  const { title } = useTitle();
  const [currentTab, setCurrentTab] = useState(0);
  const [fontTitleClass, setFontTitleClass] = useState("text-2xl");
  const router = useRouter();

  const tabData = [
    {
      id: "vessel",
      name: "Vessel View",
    },
    {
      id: "port",
      name: "Port View",
    },
  ];

  const updateZoom = () => {
    const zoomLevel = window.devicePixelRatio;

    if (getOS().toLowerCase().startsWith("windows")) {
      if (zoomLevel >= 1.5) {
        setFontTitleClass('text-xl');
      } else if (zoomLevel >= 1) {
        setFontTitleClass('text-2xl');
      } else if (zoomLevel >= 0.7) {
        setFontTitleClass('text-[1.68rem]');
      } else {
        setFontTitleClass(`text-3xl`);
      }
    }
    if (getOS().toLowerCase().startsWith("mac")) {
      if (zoomLevel >= 2.5) {
        setFontTitleClass('text-xl');
      } else if (zoomLevel >= 2) {
        setFontTitleClass('text-2xl');
      } else if (zoomLevel >= 1) {
        setFontTitleClass('text-[1.68rem]');
      } else {
        setFontTitleClass('text-3xl');
      }
    }
  };

  useEffect(() => {
    updateZoom();
    window.addEventListener('resize', updateZoom);

    return () => {
      window.removeEventListener('resize', updateZoom);
    };
  }, []);

  return (
    <>
      <div className="px-4 pt-4 pb-0 col-span-full xl:mb-0 -mt-2 space-y-0">
        {/* Title Header */}
        <div className="flex top-0 justify-between">
          <header className="items-center">
            <h2 className={`${fontTitleClass} font-bold font-[nunito]`}>{title}</h2>
          </header>
          <div className="items-center">
            {router.pathname === "/" && (
              <SlidingTabBar data={tabData} onActiveTabChange={(idx) => { setCurrentTab(idx); onTabChange(idx); }} />
            )}
          </div>
        </div>
        {/* Breadcrumbs */}
        <nav className="ml-0.5 flex justify-start -translate-y-1" aria-label="Breadcrumb">
          <ol className="inline-flex gap-1 items-center text-[10px] font-normal">
            {router.pathname !== "/document-upload" && (
              <>
                <li className="inline-flex items-center">
                  <a href="#" className="inline-flex items-center text-gray-300 ">
                    Overview
                  </a>
                </li>
                <li className="inline-flex items-center">
                  <img src="/assets/chevron-right.svg" alt="Logo Icon" className="w-3" />
                </li>
              </>
            )}
            <li className="inline-flex items-center">
              <a href="#" className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-white">
                {router.pathname === "/" ? tabData[currentTab].name.replace(" ", "-").toLowerCase() : router.pathname.replace("/", "").toLowerCase()}</a>
            </li>
          </ol>
        </nav>
      </div>
    </>
  );
};

export default Header;
