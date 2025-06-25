import { useToastAlert } from "@/context/ToastAlertContext";
import { Alert } from "flowbite-react";

const AlertBanner = () => {
    const { toastAlerts, removeToastAlert } = useToastAlert();

    return (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 space-y-3 w-full max-w-md px-4">
            {toastAlerts.map((toast) => (
            <div
                key={toast.id}
                className="transition-all duration-500 ease-in-out opacity-100 translate-y-0"
            >
                <Alert 
                    color="red" 
                    className="font-[nunito] mx-14 p-2 text-xs"
                    onDismiss={() => removeToastAlert(toast.id)}
                    rounded 
                    withBorderAccent
                >
                    <span className="font-semibold">{toast.message}</span>
                </Alert>
            </div>
            ))}
        </div>
    )
}

export default AlertBanner