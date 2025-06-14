// Third Party Libraries
import React from 'react';

//Local Libraries
import styles from './index.module.css';

type DefaultDropdownItemProps = {
	children: React.ReactNode;
	className?: string;
};

export default function DefaultDropdownItem({ children, className }: DefaultDropdownItemProps) {
	return <div className={`${styles.dropdownItemInnerDefault} ${className}`}>{children}</div>;
}
