import React from 'react';
import styles from './index.module.css'
import { ExportIcon, DownloadCSVIcon, DownloadPNGIcon } from '../../constants/icons'
import Dropdown from '../Dropdown'


type Props = {
    children?: React.ReactNode;
}

export default function ExportButton() {

    const downloadCSV = {
        id: "downloadCSV",
        label: "Download CSV",
        icon: DownloadCSVIcon,
        onClick: () => alert("dowload csv!")
    };

    const downloadPNG = {
        id: "downloadPNG",
        label: "Download PNG",
        icon: DownloadPNGIcon,
        onClick: () => alert("dowload png!")
    };

    const testElement = {
        id: "test",
        label: "Test Element that is going to be way longer than 256px",
        icon: DownloadPNGIcon,
        onClick: () => alert("dowload test!")
    };

    return (
        <Dropdown items={[downloadCSV, downloadPNG, testElement]} align='right'>
            <div className={styles.icon}>
                <ExportIcon className={styles.exportIcon}/>       
            </div>
        </Dropdown>
    );
}