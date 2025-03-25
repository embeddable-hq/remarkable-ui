import React from 'react';
import styles from './index.module.css'
import { ExportIcon } from '../../constants/icons'
import Dropdown from '../Dropdown'


type Props = {
    children?: React.ReactNode;
}

const items = [
    {
        id: "download",
        label: "download",
        icon: ExportIcon
    }
]

export default function ExportButton() {

    const downloadCSV = {
        id: "download",
        label: "Download CSV",
        icon: ExportIcon
    };

    const downloadPNG = {
        id: "download",
        label: "Download PNG",
        icon: ExportIcon
    };

    return (
        <Dropdown items={items} align='right'>
            <div className={styles.icon}>
                <ExportIcon/>       
            </div>
        </Dropdown>
    );
}