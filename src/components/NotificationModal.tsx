import React, { useEffect, useState } from "react";
import SlidingTabBar from "./SlidingTabBar";
import { NotificationType } from "@/utils/Types";
import { getElapsedTime } from "@/utils/Utils";
import { SlidingTabMode } from "@/utils/enums/TabEnum";

type NotificationProps = {
    open: boolean,
    onOpen: (value: boolean) => void
    source: NotificationType
}

const NotificationModal: React.FC<NotificationProps> = ({open, onOpen, source}) => {

    const [vesselNotifData, setVesselNotifData] = useState<NotificationType>(null);
    const [portNotifData, setPortNotifData] = useState<NotificationType>(null);
    const [vesselToBunkerNotifData, setVesselToBunkerNotifData] = useState<NotificationType>(null);
    const [unreadCount, setUnreadCount] = useState(0);
    
    const notifTab = [
        {
            id: "vessel",
            name: "Vessel Performance",
        },
        {
            id: "port",
            name: "Port Performance",
        },
        {
            id: "bunker",
            name: "Vessel to Bunker",
        },
    ];
    const [contents, setContent] = useState<NotificationType>(null);

    useEffect(() => {
        if (source && !contents) {
            setVesselNotifData({...source, data: {...source.data, notifications: source.data.notifications.filter(it => it.notifications.some(each => each.category === 'vessel'))}});
            setPortNotifData({...source, data: {...source.data, notifications: source.data.notifications.filter(it => it.notifications.some(each => each.category === 'port'))}});
            setVesselToBunkerNotifData({...source, data: {...source.data, notifications: source.data.notifications.filter(it => it.notifications.some(each => each.category === 'vessel_to_bunker'))}});
            setUnreadCount(source.data.unread);
            setTimeout(() => setContent({...source, data: {...source.data, notifications: source.data.notifications.filter(it => it.notifications.some(each => each.category === 'vessel'))}}));
        }
    }, []);

    const onHandleChangeTab = (val) => {
        setContent(() => {
            switch (val) {
                case 0:
                    return vesselNotifData
                case 1:
                    return portNotifData
                default:
                    return vesselToBunkerNotifData
            }
        })
    }
    
  return (
    <div className="fixed inset-0 z-[9999] font-[nunito]">
        {/* Modal Overlay */}
        <div
            className={`fixed inset-0 bg-black/40 transition-opacity ${
                open ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
            onClick={() => onOpen(false)}
        />

        {/* Right Side Notification Panel */}
        <div
            className={`fixed top-0 right-0 h-full w-auto bg-white shadow-lg z-50 transition-transform duration-1000 ${
                open ? "-translate-x-0" : "translate-x-full"
            }`}
        >
            {/* Header */}
            <div className="pl-8 pr-10 pt-5 pb-5 flex flex-col border-b gap-4">
                <div className="flex justify-end">
                    <button onClick={() => onOpen(false)} className="text-black text-lg">
                        ✕
                    </button>
                </div>
                <div className="flex justify-start items-center gap-3">
                    <h2 className="text-2xl font-extrabold">Notifications</h2>
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white text-xs">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                </div>
            </div>
            {/* Notification Content */}
            <div className="flex flex-col px-8 pt-5 pb-2">
                <SlidingTabBar mode={SlidingTabMode.WIDE} data={notifTab} onActiveTabChange={(idx) => onHandleChangeTab(idx)} />
            </div>
            <div className="px-8 pr-0 mr-2 pb-48 max-h-[calc(100%)] overflow-y-auto rounded-scrollbar">
                <div className="flex flex-col max-w-[600px] gap-2 text-black">
                    {contents && contents.data.notifications.map((it, index) => (
                        <React.Fragment key={index}>
                            <span className="pt-2 text-xs text-gray-600">{it.date.toLocaleDateString("id-ID", {weekday: 'long', day: '2-digit', month: 'short'})}</span>
                            {it.notifications.map((each, idx) => (
                                <div
                                    key={idx}
                                    className="p-3 bg-[#F9FAFA] rounded-[1.25rem]"
                                >
                                    <div className="flex flex-col items-start gap-1 flex-[1_0_0]">
                                        <div className="flex items-center gap-1">
                                            <img src="/assets/triangle-warning-black.svg" alt="triangle warning icon" className="w-5" />
                                            <span className="text-xs font-bold">{each.title.split('-')[0]}</span>
                                            <span className="text-xs font-normal">-{each.title.split('-')[1]}</span>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="text-[0.688rem] font-normal">
                                                {each.message}
                                            </span>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="text-[0.5rem] text-[#90A2A2] font-normal">
                                                {getElapsedTime(each.created_time.getTime())}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    </div>
  )
}

export default NotificationModal