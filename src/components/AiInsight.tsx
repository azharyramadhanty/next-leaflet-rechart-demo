import Image from "next/image"

const AiInsight = ({children}) => {
  return (
    <div className="flex items-start gap-4 p-4 self-stretch rounded-3xl bg-blue-200">
        <div className="flex flex-col items-start gap-2 flex-[1_0_0]">
            <div className="flex items-start gap-2">
                <Image src={'assets/ai-insight-icon.svg'} alt={'ai insight logo'} width={0} height={0} style={{width: 'auto'}} />
                <span className="text-gray-700 text-lg font-bold">AI Insights</span>
            </div>
            <div className="flex items-start ml-9">
                {children}
            </div>
        </div>
    </div>
  )
}

export default AiInsight