// Third Party Libraries
import React from "react";

// Local Libraries
import styles from "./index.module.css";

type EllipsisProps = {
	children: React.ReactNode;
};

export default function Ellipsis({ children }: EllipsisProps) {
	return <span className={styles.ellipsis}>{children}</span>;
}
