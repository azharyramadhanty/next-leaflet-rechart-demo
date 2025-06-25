import { getOS } from "@/utils/Utils";
import { useEffect, useState } from "react";

type GradientCardProps = {
  title: string,
  value: string,
  value2?: string,
  notation?: string,
  bgCol: string,
  showTooltip?: boolean,
  tooltip?: React.JSX.Element,
  discrepancy?: string,
  showViewDetail?: boolean,
  onViewDetail?: () => void,
}

const GradientCard = ({ title, value, value2, notation, bgCol, discrepancy, showTooltip = false, tooltip = null, showViewDetail = false, onViewDetail }: GradientCardProps) => {
  const [fontTitleClass, setFontTitleClass] = useState('text-[0.563rem');
  const [fontBodyClass, setFontBodyClass] = useState('text-base');
  const [fontBodyNotationClass, setFontBodyNotationClass] = useState('text-[0.375rem]');
  const [fontFooterClass, setFontFooterClass] = useState('text-[0.45rem]');
  const [fontFooterAdditionalClass, setFontFooterAdditionalClass] = useState('text-[0.75rem]');

  const updateZoom = () => {
    const zoomLevel = window.devicePixelRatio;

    if (getOS().toLowerCase().startsWith("windows")) {
      if (zoomLevel >= 1.5) {
        setFontTitleClass('text-[0.563rem]');
        setFontBodyClass('text-base');
        setFontBodyNotationClass('text-[0.5rem]');
        setFontFooterClass('text-[0.45rem]');
        setFontFooterAdditionalClass('text-xs');
      } else if (zoomLevel >= 1) {
        setFontTitleClass('text-xs');
        setFontBodyClass('text-lg');
        setFontBodyNotationClass('text-[0.563rem]');
        setFontFooterClass('text-[0.563rem]');
        setFontFooterAdditionalClass('text-xs');
      } else if (zoomLevel >= 0.7) {
        setFontTitleClass('text-xs');
        setFontBodyClass('text-base');
        setFontBodyNotationClass('text-[0.5rem]');
        setFontFooterClass('text-[0.563rem]');
        setFontFooterAdditionalClass('text-xs');
      } else {
        setFontTitleClass('text-lg');
        setFontBodyClass('text-xl');
        setFontBodyNotationClass('text-[0.625rem]');
        setFontFooterClass('text-base');
        setFontFooterAdditionalClass('text-xl');
      }
    }
    if (getOS().toLowerCase().startsWith("mac")) {
      if (zoomLevel >= 2.5) {
        setFontTitleClass('text-[0.563rem]');
        setFontBodyClass('text-base');
        setFontBodyNotationClass('text-[0.375rem]');
        setFontFooterClass('text-[0.5rem]');
        setFontFooterAdditionalClass('text-xs');
      } else if (zoomLevel >= 2) {
        setFontTitleClass('text-xs');
        setFontBodyClass('text-lg');
        setFontBodyNotationClass('text-[0.563rem]');
        setFontFooterClass('text-[0.563rem]');
        setFontFooterAdditionalClass('text-xs');
      } else if (zoomLevel >= 1) {
        setFontTitleClass('text-xs');
        setFontBodyClass('text-base');
        setFontBodyNotationClass('text-[0.5rem]');
        setFontFooterClass('text-[0.563rem]');
        setFontFooterAdditionalClass('text-xs');
      } else {
        setFontTitleClass('text-lg');
        setFontBodyClass('text-xl');
        setFontBodyNotationClass('text-[0.625rem]');
        setFontFooterClass('text-base');
        setFontFooterAdditionalClass('text-xl');
      }
    }
  };

  useEffect(() => {
    updateZoom();
    window.addEventListener('resize', updateZoom);

    return () => {
      window.removeEventListener('resize', updateZoom);
    }
  });

  return (
    <div className={`flex flex-col min-w-24 w-full min-h-[4rem] h-full ${bgCol} text-white rounded-[20px] hover:shadow-lg transition-shadow duration-300`}>
      <div className="flex pt-2.5 pl-3 pr-3 justify-stretch gap-0.5">
        <h2 className={`min-h-9 ${fontTitleClass} font-extralight font-[nunito]`}>{title}</h2>
        {showTooltip && (tooltip)}
      </div>
      <div className="flex -my-1 pl-3 pr-1 justify-start items-center">
        <p className={`${fontBodyClass} text-center font-bold font-[nunito] truncate`}>
          {value}{value2 && (<span className={`font-extralight text-[0.98rem] ml-0.5 mr-0.5`}>|</span>)}{value2 && value2} {notation && (<span className={`font-extralight ${fontBodyNotationClass}`}>{notation}</span>)}
        </p>
        {discrepancy && (
          <span className={`w-auto text-white bg-[rgba(255,255,255,0.20)] rounded-full px-2 py-1 ${fontFooterAdditionalClass} font-[nunito]`}>{discrepancy}</span>
        )}
      </div>
      <div className="flex py-0.5 pl-3 pr-1 gap-0.5">
        <p onClick={onViewDetail} className={`${showViewDetail && 'underline'} ${fontFooterClass} cursor-pointer`}>{showViewDetail ? 'View Details' : (<span>&nbsp;</span>)}</p>
        { showViewDetail && (<img src="/assets/arrow-up-right.svg" alt="Arrow Up Icon" className="w-3" />)}
      </div>
    </div>

  );
};

export default GradientCard;