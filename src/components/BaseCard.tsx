import { BaseCardType } from "@/utils/enums/CardEnum";
import Image from "next/image";

type BaseCardProps = {
  title: string,
  type?: BaseCardType,
  value: string,
  additionalValue?: string,
  dateSourceValue?: string
  notation: string,
  iconUrl?: string,
  onPress?: () => void,
}

const BaseCard = ({ title, type = BaseCardType.NORMAL, value, additionalValue, dateSourceValue, notation, iconUrl, onPress }: BaseCardProps) => {
  return (
    <div
      className={`flex ${type === BaseCardType.COMPACT ? 'min-h-5' : 'min-h-[5.4rem]'} min-w-28 w-full h-full pt-2 pb-2 pr-3 bg-[#F9FAFA] hover:shadow-md text-left rounded-xl`}
      onClick={onPress}>
      <div className="flex flex-col">
        <div className="flex-grow items-start">
          <div className="flex justify-between gap-6">
            <p className="pl-3 w-full font-normal font-[nunito] text-[11px]">{title}</p>
            {iconUrl && (<img src={iconUrl} alt="Icon" className="w-auto" />)}
          </div>
          {dateSourceValue && (<div className="flex">
            <Image className="translate-x-3" src="/assets/small-refresh-icon.svg" alt={"refresh-icon"} width={0} height={0} style={{ width: 'auto' }} />
            <span className="translate-x-4 text-[0.45rem] text-center text-[#90A2A2] font-normal font-[nunito]">{dateSourceValue}</span>
            </div>)}
        </div>
        {additionalValue && (<span className="w-16 translate-x-3 bg-white rounded-2xl text-[0.45rem] text-center text-[#0E3858] font-normal font-[nunito]">{additionalValue}&#37; remaining</span>)}
        <div className="flex pl-3 items-end font-bold font-[nunito]">
          <span className={`${type === BaseCardType.COMPACT ? 'text-base translate-y-[0.2rem]' : 'text-xl translate-y-[0.3rem]'} text-black`}>{value}</span>
          <span className="text-[0.6rem] text-black">&nbsp;{notation}</span>
        </div>
      </div>
    </div>
  );
};

export default BaseCard;