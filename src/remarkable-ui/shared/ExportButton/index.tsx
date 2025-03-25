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
        onClick: () => console.log("dowload csv!")
    };

    const downloadPNG = {
        id: "downloadPNG",
        label: "Download PNG",
        icon: DownloadPNGIcon,
        onClick: () => console.log("dowload png!")
    };

    return (
        <Dropdown items={[downloadCSV, downloadPNG]} align='right'>
            <div className={styles.icon}>
                <ExportIcon className={styles.exportIcon}/>       
            </div>
        </Dropdown>
    );
}