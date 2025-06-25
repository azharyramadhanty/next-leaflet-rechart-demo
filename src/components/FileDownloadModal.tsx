import { EvidenceType } from "@/utils/Types";
import { Modal } from "flowbite-react";
import Image from "next/image";

interface FileDownloadModalProps {
    title: string;
    isOpen?: boolean;
    handleShow: (open: boolean) => void;
    dataFile?: EvidenceType[];
}

const FileDownloadModal: React.FC<FileDownloadModalProps> = ({
    title,
    isOpen = false,
    handleShow,
    dataFile
}) => {

    return (
        <Modal dismissible style={{height: 'auto'}} show={isOpen} size="2xl" onClose={() => handleShow(false)}>
            <Modal.Header>{title}</Modal.Header>
            <Modal.Body>
                <div className="flex flex-col gap-4 font-[nunito]">
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-bold">Evidence Document</span>
                        <div className="flex w-full items-center justify-center">
                            { dataFile.map((file, index) => (
                                <div key={index} className="flex justify-between p-4 rounded-[20px] border border-[#C7D1D1]">
                                    <a href={file.fileUrl} className="flex gap-2 justify-start">
                                        <Image src={'assets/file-icon.svg'} alt={'file icon'} width={0} height={0} style={{width: 'auto'}} />
                                        <span className="underline">{file.fileName}</span>
                                        <Image src={'assets/download-icon.svg'} alt={'download icon'} width={0} height={0} style={{width: 'auto'}} />
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default FileDownloadModal;