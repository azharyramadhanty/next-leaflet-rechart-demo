import { BunkerConfirmModalType } from "@/utils/enums/ScheduleAdjustVerifyEnum";
import { BunkerPlanScheduledType } from "@/utils/Types";
import { changeFormatEnumValue } from "@/utils/Utils";
import { Button, Modal } from "flowbite-react";

type BunkerPlanConfirmationModalProps = {
  visible: boolean,
  type: BunkerConfirmModalType,
  data: BunkerPlanScheduledType,
  onOk: () => void,
  onClose: () => void
}

const BunkerPlanConfirmationModal = ({ visible, type, data, onClose, onOk }: BunkerPlanConfirmationModalProps) => {
  return (
    <Modal
      className="ps-10 py-20 bg-gray-900 bg-opacity-50 font-[nunito] dark:bg-opacity-80"
      dismissible={false}
      position="center"
      size="xl"
      show={visible}
      onClose={onClose}
      popup>
      <Modal.Body>
        <div className="flex-1">
          <p className="text-lg mt-5 mb-3 text-start font-bold">Confirm{type === BunkerConfirmModalType.COMPLETED ? ' Completion' : ' Cancellation'}</p>
          <p className="text-sm mb-3 text-start font-bold">Bunker Plan Item</p>
          <p className="min-w-16 mb-1 text-xs font-bold text-[#030C13] truncate">Details</p>
          <div className="grid grid-cols-3 mt-1 mb-4">
            <div className="flex-col items-center">
              <p className="min-w-16 mb-1 text-[0.625rem] font-normal text-[#90A2A2] truncate">Vessel</p>
              <p className="min-w-16 text-[0.76rem] font-normal text-[#030C13] truncate">{data && data.vesselName}</p>
            </div>
            <div className="flex-col items-center">
              <p className="min-w-16 mb-1 text-[0.625rem] font-normal text-[#90A2A2] truncate">Bunker Port</p>
              <p className="min-w-16 text-[0.76rem] font-normal text-[#030C13] truncate">{data && data.bunkerPort}</p>
            </div>
            <div className="flex-col items-center font-[nunito]">
              <p className="min-w-16 mb-1 text-[0.625rem] font-normal text-[#90A2A2] truncate">Bunker Date</p>
              <p className="min-w-16 text-[0.76rem] font-normal text-[#030C13] truncate">{data && data.bunkerDate.toLocaleDateString("id-ID", {weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'})}</p>
            </div>
          </div>
          <p className="min-w-16 mb-1 text-xs font-bold text-[#030C13] truncate">Bunker Amount</p>
          <div className="grid grid-cols-3 mt-1 gap-3 mb-8">
            <div className="flex-col items-center">
              <p className="min-w-16 mb-1 text-[0.625rem] font-normal text-[#90A2A2] truncate">MFO</p>
              <p className="min-w-16 text-[0.76rem] font-normal text-[#030C13] truncate">{data && data.mfoVol ? data.mfoVol : "- MT"}</p>
            </div>
            <div className="flex-col items-center">
              <p className="min-w-16 mb-1 text-[0.625rem] font-normal text-[#90A2A2] truncate">HFO</p>
              <p className="min-w-16 text-[0.76rem] font-normal text-[#030C13] truncate">{data && data.hfoVol ? data.hfoVol : "- MT"}</p>
            </div>
            <div className="flex-col items-center">
              <p className="min-w-16 mb-1 text-[0.625rem] font-normal text-[#90A2A2] truncate">LFO</p>
              <p className="min-w-16 text-[0.76rem] font-normal text-[#030C13] truncate">{data && data.lfoVol != null ? data.lfoVol : "- MT"}</p>
            </div>
            <div className="flex-col items-center">
              <p className="min-w-16 mb-1 text-[0.625rem] font-normal text-[#90A2A2] truncate">MDF</p>
              <p className="min-w-16 text-[0.76rem] font-normal text-[#030C13] truncate">{data && data.mdfVol ? data.mdfVol : "- MT"}</p>
            </div>
            <div className="flex-col items-center font-[nunito]">
              <p className="min-w-16 mb-1 text-[0.625rem] font-normal text-[#90A2A2] truncate">MGO</p>
              <p className="min-w-16 text-[0.76rem] font-normal text-[#030C13] truncate">{data && data.mgoVol != null ? data.mgoVol : "- MT"} </p>
            </div>
            <div className="flex-col items-center">
              <p className="min-w-16 mb-1 text-[0.625rem] font-normal text-[#90A2A2] truncate">HSD</p>
              <p className="min-w-16 text-[0.76rem] font-normal text-[#030C13] truncate">{data && data.hsdVol ? data.hsdVol : "- MT"}</p>
            </div>
          </div>
          <p className="min-w-16 text-xs font-normal text-[#030C13] truncate">Are you sure you want to mark bunker plan as {changeFormatEnumValue(type)}?</p>
        </div>
      </Modal.Body>
      <Modal.Footer className="justify-end">
        <Button size="sm" color="gray" className="px-8 py-0 rounded-full ring-transparent" onClick={onClose}>No</Button>
        <Button size="sm" color="failure" className={`${type === BunkerConfirmModalType.COMPLETED ? "bg-[#CCFFDF] text-[#00802F]" : "bg-[#E21328]"} px-8 py-0 rounded-full ring-transparent`} onClick={onOk}>Yes, {type === BunkerConfirmModalType.COMPLETED ? "Complete." : "Cancel."}</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default BunkerPlanConfirmationModal;