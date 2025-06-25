import { DataType } from "@/utils/Types"

type InfoListProp = {
    title: string,
    data: DataType[]
}

const InfoListCard: React.FC<InfoListProp> = ({title, data}) => {
  return (
    <div className="flex flex-col bg-white p-6 gap-4 font-[nunito] border border-gray-200 dark:bg-gray-800 dark:border-gray-700 shadow-md rounded-2xl overscroll-auto overflow-hidden">
        <h3 className="font-bold text-base">{title}</h3>
        <ul role="list" className="divide-y-0 divide-white">
            { data.map((i, index) => (  
                <li key={index} className="odd:bg-white even:bg-[#D3DFE530] px-3 py-2 items-center justify-between">
                    <div className="flex items-center">
                        <div className="flex-1 min-w-0">
                            <p className="text-[0.8rem] font-normal text-[#90A2A2] truncate dark:text-white">
                                {i.key}
                            </p>
                        </div>
                        <div className="inline-flex text-[0.8rem] font-semibold items-center text-black dark:text-white">
                            {i.value}
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    </div>
  )
}

export default InfoListCard