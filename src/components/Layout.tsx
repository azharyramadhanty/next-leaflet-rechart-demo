import { ReactNode, useCallback, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import HeaderAccount from "./HeaderAccount";
import Skeleton from "./Skeleton";
import { getCookie } from "@/utils/Utils";
import NotificationModal from "./NotificationModal";
import { useNotification } from "@/hooks/notification/useNotification";
import { NotificationType } from "@/utils/Types";
import { useRouter } from "next/router";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const [userDisplayName, setUserDisplayName] = useState("-");
  const [isLoading, setLoading] = useState(false);
  const [isNotif, setIsNotif] = useState(false);
  const { useAllNotification } = useNotification();
  const {
    data: fetchNotificationData,
    error: fetchNotificationErrorData,
    isError: fetchNotificationError,
    isSuccess: fetchNotificationSuccess
  } = useAllNotification();
  const [notificationList, setNotificationList] = useState<NotificationType>(null);

  const handleChangeNotif = (value) => {
    setIsNotif(value)
  }

  const updateNotification = useCallback(() => {
    if (fetchNotificationSuccess) {
      setNotificationList(fetchNotificationData);
    }
  }, [fetchNotificationData]);

  useEffect(() => {
    setUserDisplayName(getCookie("name"));
    if (fetchNotificationError) {
      // console.log("fetch notification error", fetchNotificationErrorData);
    } else {
      updateNotification();
    }

  }, [
    fetchNotificationError,
    fetchNotificationSuccess
  ]);

  return (
    <div className="flex h-screen">
      {router.pathname !== '/authentication' && (<Sidebar />)}
      <div className="relative flex flex-1 flex-col overflow-auto">
        <HeaderAccount name={userDisplayName} onClickNotif={handleChangeNotif} />
        <Header
          onTabChange={(activeIdx) => {
            setLoading(!isLoading);
            sessionStorage.setItem('currentTab', String(activeIdx));
            //replace this timeout later with real api call every tab change
            setTimeout(() => setLoading(false), 1000);
          }} />
        {isLoading ? (
          <div className="flex flex-row h-screen gap-40 justify-center items-center">
            <Skeleton />
            <Skeleton />
          </div>
        ) : children}
        {/* {children} */}
      </div>
      {isNotif && (
        <NotificationModal open={isNotif} onOpen={setIsNotif} source={notificationList} />
      )}
      {/* {children} */}
    </div>
  );
};

export default Layout;
