import Image from "next/image";
import React from "react";
import Tooltip from "./Tooltip";
import { ButtonType } from "@/utils/enums/TooltipEnum";

export type ActivityDataType = {
  port: string,
  status: string,
}

type ActivityProp = {
  title?: string,
  isBunkering?: boolean,
  data: ActivityDataType[]
  departureTime?: string,
  arrivalTime?: string
}

const ActivityCard: React.FC<ActivityProp> = ({ title = "Activity", isBunkering = false, data, departureTime, arrivalTime }) => {
  return (
    <div className="p-6 flex flex-col gap-4 font-[nunito] bg-white text-gray-900 border border-gray-200 rounded-2xl shadow-md">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">{title}</h3>
        {isBunkering && (
          <>
            <div className="flex gap-1">
              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-success-light text-success">
                Bunker performed
              </span>
              <Tooltip
                title="Bunkering Performed"
                type={ButtonType.QUESTION_MARK}
              >
                <span className="text-[0.625rem] font-normal font-[nunito]">
                  A bunkering activity has been successfully performed during the voyage.
                </span>
              </Tooltip>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center text-gray-900 text-sm font-bold">
          {data.map((i, index) => {

            let itemAlign, imgSrc, imgAlt

            switch (index) {
              case 0:
                itemAlign = "items-start"
                imgSrc = "start-port"
                imgAlt = "From Port Icon"
                break;
              case data.length - 1:
                itemAlign = "items-end"
                imgSrc = "end-port-blue"
                imgAlt = "To Port Icon"
                break;
              default:
                itemAlign = "items-center"
                imgSrc = "transit-port"
                imgAlt = "Transit Port Icon"
            }

            return (
              <React.Fragment key={index}>
                <div className={`flex flex-col gap-2 ${itemAlign}`}>
                  <p>{i.port}</p>
                  <div className="flex items-center gap-1 w-full">
                    {index > 0 && index < data.length && (
                      <div className="w-full border-radius-lg h-1 bg-blue-500 rounded-r-full"></div>
                    )}
                    <Image src={`/assets/${imgSrc}.svg`} alt={imgAlt} width={0} height={0} style={{ width: 'auto' }} />
                    {index < data.length - 1 && (
                      <div className="w-full border-radius-lg h-1 bg-blue-500 rounded-l-full"></div>
                    )}
                  </div>
                  <p>{i.status}</p>
                </div>
                {index === data.length - 1 || (
                  <div className="flex-grow border-radius-lg h-1 bg-blue-500"></div>
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>
      <div className="flex justify-between items-center text-xs font-normal">
        <div className="flex flex-col items-start">
          <p className="text-[#90A2A2]">Actual time of departure</p>
          <p className="font-bold text-gray-900">{departureTime ?? "-"}</p>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-[#90A2A2]">Actual time of arrival</p>
          <p className="font-bold text-gray-900">{arrivalTime ?? "-"}</p>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;