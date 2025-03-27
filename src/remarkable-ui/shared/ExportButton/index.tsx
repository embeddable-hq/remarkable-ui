import React from 'react';
import styles from './index.module.css'
import { ExportIcon, DownloadCSVIcon, DownloadPNGIcon } from '../../constants/icons'
import Dropdown from '../Dropdown'

type SetBoolean = React.Dispatch<React.SetStateAction<boolean>>;

type ExportButtonProps = {
    setLocalLoading: SetBoolean;
}

const handleDownload = (setLocalLoading:SetBoolean) => {
    alert("dowload csv!")
    setLocalLoading(true);
}

export default function ExportButton({setLocalLoading}:ExportButtonProps) {

    const downloadCSV = {
        id: "downloadCSV",
        label: "Download CSV",
        icon: DownloadCSVIcon,
        onClick: () => handleDownload(setLocalLoading)
    };

    const downloadPNG = {
        id: "downloadPNG",
        label: "Download PNG",
        icon: DownloadPNGIcon,
        onClick: () => alert("dowload png!")
    };

    // const testElement = {
    //     id: "test",
    //     label: "Test Element that is going to be way longer than 256px",
    //     icon: DownloadPNGIcon,
    //     onClick: () => alert("dowload test!")
    // };

    return (
        <Dropdown items={[downloadCSV, downloadPNG]} align='right'>
            <div className={styles.icon}>
                <ExportIcon className={styles.exportIcon}/>       
            </div>
        </Dropdown>
    );
}