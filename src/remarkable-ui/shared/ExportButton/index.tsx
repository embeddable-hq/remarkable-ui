import React from 'react';
import { ExportIcon, DownloadCSVIcon, DownloadPNGIcon } from '../../constants/icons'
import Dropdown from '../Dropdown'
import IconButton from '../IconButton';

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

    const veryLongOption = {
        id: "something",
        label: "Something way too long has to go here for testing",
        icon: DownloadPNGIcon,
        onClick: () => alert("dowload png!")
    };

    return (
        <Dropdown items={[downloadCSV, downloadPNG, veryLongOption]} align='right'>
            <IconButton icon={ExportIcon}/>
        </Dropdown>
    );
}