import { BarLegendType } from "@/components/MainBarChart";
import { BarChartType } from "@/utils/enums/ChartEnum";
import { BarDataType } from "@/utils/Types";
import { Button, Modal } from "flowbite-react";
import dynamic from "next/dynamic";

const MainBarChart = dynamic(() => import("@/components/MainBarChart"), { ssr: false })

type BunkerSupplyModalProps = {
  visible: boolean,
  bunkerData: BarDataType[],
  legends: BarLegendType,
  onClose: () => void
}

const BunkerSupplyModal = ({ visible, bunkerData, legends, onClose }: BunkerSupplyModalProps) => {
  return (
    <Modal
      className="ps-10 py-20 bg-gray-900 bg-opacity-50 dark:bg-opacity-80"
      dismissible
      position="center"
      size="xl"
      show={visible}
      onClose={onClose}>
      <Modal.Header>Bunker Supply Trends</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <MainBarChart width={450} height={250} legends={legends} type={BarChartType.STACKED} data={bunkerData} />
        </div>
      </Modal.Body>
      {/* <Modal.Footer>
        <Button color="blue" onClick={() => { }}>I accept</Button>
        <Button color="gray" onClick={() => { }}>
          Decline
        </Button>
      </Modal.Footer> */}
    </Modal>
  );
}

export default BunkerSupplyModal;