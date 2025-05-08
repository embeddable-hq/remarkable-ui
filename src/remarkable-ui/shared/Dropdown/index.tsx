import React, { useState, useRef, useEffect } from 'react';
import DropdownMenu from './DropdownMenu';
import styles from './index.module.css'
import { DataResponse } from '@embeddable.com/core';

export type DropdownItem = {
  icon?: React.ComponentType<{ className?: string }>;
  id: string;
  label: string;
  onClick?: (data?: DataResponse["data"]) => void;
  customContent?: React.ReactNode;
};

type DropdownProps = {
  align?: 'left' | 'right';
  children: React.ReactNode;
  className?: string;
  items: DropdownItem[];
}

const Dropdown = ({ children, items, className, align = 'left' }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return; // only add listener when isOpen is true
  
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (item: DropdownItem) => {
    item.onClick?.();
    setIsOpen(false);
  };

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <div onClick={handleToggle}>
        {React.isValidElement(children)
          ? React.cloneElement(children as React.ReactElement<any>, {
              onClick: handleToggle,
            })
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