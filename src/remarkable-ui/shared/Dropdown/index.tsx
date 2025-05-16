import React, { useState, useRef, useEffect } from 'react';
import DropdownMenu from './DropdownMenu';
import styles from './index.module.css'
import { DataResponse } from '@embeddable.com/core';

export type DropdownItem = {
  icon?: React.ComponentType<{ className?: string }>;
  id: string;
  label?: string;
  onClick?: (item?: DataResponse["data"]) => void;
  customContent?: React.ReactNode;
};

type DropdownProps = {
  align?: 'left' | 'right';
  children: React.ReactElement<{ isOpen?: boolean }>;
  className?: string;
  items: DropdownItem[];
  closeDropdownOnItemClick?: boolean;
}

const Dropdown = ({ children, items, className, align = 'left', closeDropdownOnItemClick = true }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onDocClick = (e: MouseEvent) => {
      //Use composedPath rather than target because the click lands on a web-component host, and browser events through Shadow DOM don't bubble in the normal way.
      const path = e.composedPath?.() as EventTarget[];
      if (!path.includes(dropdownRef.current!)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [isOpen]);

  const handleItemClick = (item: DropdownItem) => {
    item.onClick?.();
    if (closeDropdownOnItemClick) {
      setIsOpen(false);
    }
  };

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <div className={styles.dropdownButtonContainer} onClick={() => setIsOpen(prev => !prev)}>
        {React.isValidElement(children)
          ? React.cloneElement(children, { isOpen })
          : children}
      </div>
      <DropdownMenu
        isOpen={isOpen}
        closeDropdown={() => setIsOpen(false)}
        items={items}
        onItemClick={handleItemClick}
        align={align}
      />
    </div>
  );
};

export default Dropdown;