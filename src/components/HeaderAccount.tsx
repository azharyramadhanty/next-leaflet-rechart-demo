
export type HeaderAccountProps = {
    name: string,
    onClickNotif: (value: boolean) => void
}

const HeaderAccount: React.FC<HeaderAccountProps> = ({name = "", onClickNotif}) => {

    const getInitials = (name: string) => {
        return name
            .match(/(\b\S)?/g).join("")
            .match(/(^\S|\S$)?/g)
            .join("")
            .toUpperCase();
    };

    return (
        <div className="sticky top-0 z-50 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
            <div className="flex flex-grow items-center justify-end px-4 py-4 shadow-2">
                <ul className="flex items-center gap-2 2xsm:gap-4">
                    <button className="group" onClick={() => onClickNotif(true)}>
                        <img src="/assets/notification-bell.svg" alt="Avatar Icon" className="w-6" />
                    </button>
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-300 text-blue-600 text-base text-center font-bold font-[nunito] rounded-full border-2 border-blue-600">
                        {getInitials(name)}
                    </div>
                </ul>
            </div>
        </div>
    );
}

export default HeaderAccount;