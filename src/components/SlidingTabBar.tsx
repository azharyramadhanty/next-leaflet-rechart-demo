import { SlidingTabMode } from "@/utils/enums/TabEnum";
import { useEffect, useRef, useState } from "react";

export interface SlidingTabBarDataType {
  id: string,
  name: string,
}

interface SlidingTabBarProps {
  data: SlidingTabBarDataType[];
  activeIndex?: number;
  onActiveTabChange: (idx: number) => void;
  mode?: SlidingTabMode;
}

const SlidingTabBar: React.FC<SlidingTabBarProps> = ({ data, activeIndex = 0, onActiveTabChange, mode = SlidingTabMode.NORMAL }) => {
  const tabsRef = useRef<HTMLButtonElement[]>([]);
  const [activeTabIndex, setActiveTabIndex] = useState(activeIndex);
  const [tabUnderlineWidth, setTabUnderlineWidth] = useState(0);
  const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);

  useEffect(() => {
    if (activeTabIndex === null) {
      return;
    }

    const setTabPosition = () => {
      const currentTab = tabsRef.current[activeTabIndex] as HTMLButtonElement;
      setTabUnderlineLeft(currentTab?.offsetLeft ?? 0);
      setTabUnderlineWidth(currentTab?.clientWidth ?? 0);
      onActiveTabChange(activeTabIndex);
    };

    setTabPosition();
  }, [activeTabIndex]);

  return (
    <div className="flex h-8 rounded-full items-center justify-between border border-[#CCEAFF] bg-[#F5FBFF] px-0 backdrop-blur-sm text-base font-[nunito] font-semibold subpixel-antialiased">
      <span className="absolute bottom-0 top-0 right-0 left-0 p-0.5 -z-10 flex overflow-hidden rounded-full transition-all duration-300"
        style={{ left: tabUnderlineLeft, width: tabUnderlineWidth }}>
        <span className="h-full w-full rounded-full bg-[#0096FF] shadow-sm" />
      </span>
      {data.map((tab, index) => {
        const isActive = activeTabIndex === index;
        return (
          <button
            key={index}
            ref={(el) => { if (el) tabsRef.current[index] = el }}
            className={`${isActive ? `text-white` : `text-[#90A2A2] hover:text-neutral-500`
              } my-auto cursor-pointer select-none rounded-full px-2 ${mode === 'wide' ? 'min-w-[200px]' : 'min-w-[150px]'} w-full text-center text-xs`}
            onClick={() => setActiveTabIndex(index)}>
            {tab.name}
          </button>
        );
      })}
    </div>
  );
};

export default SlidingTabBar;
