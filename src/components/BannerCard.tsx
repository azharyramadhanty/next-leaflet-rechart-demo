import { BannerType } from "@/utils/enums/BannerEnum";

type BannerProps = {
    title?: string,
    body?: string,
    type: BannerType,
    onDismiss?: () => void
}

const BannerCard: React.FC<BannerProps> = ({title, body, type = BannerType.SUCCESS, onDismiss}) => {

    const icons: Record<BannerType, React.JSX.Element> = {
        [BannerType.DANGER]: <img src="/assets/triangle-warning.svg" alt="triangle warning icon" className="w-5" />,
        [BannerType.SUCCESS]: <img src="/assets/tickmark-green.svg" alt="checkmark green icon" className="w-5" />
    };

    return (
        <div className={`flex items-start gap-4 p-4 self-stretch rounded-3xl ${type === BannerType.DANGER ? 'bg-danger' : 'bg-[#CCFFDF]'}`}>
            <div className="flex justify-between flex-[1_0_0] gap-3">
                <div className="flex items-start gap-2">
                    { icons[type] ?? icons[BannerType.DANGER] }
                    <div className={`flex flex-col items-start gap-1 ${type === BannerType.DANGER ? 'text-white' : 'text-[#00802F]'} font-[nunito]`}>
                        { title && (<span className="text-sm text-justify font-bold">{title}</span>)}
                        <span className="text-xs items-center font-normal">
                            {body}
                        </span>
                    </div>
                </div>
                { onDismiss && (
                    <div className="items-center">
                        <span onClick={onDismiss} className="text-xs cursor-pointer text-white font-normal">
                            X
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default BannerCard