import React from 'react';
import { DropdownItem } from './index';
import styles from './index.module.css';

type DropdownMenuProps = {
  isOpen: boolean;
  items: DropdownItem[];
  onItemClick: (item: DropdownItem) => void;
  align?: 'left' | 'right';
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ 
  isOpen, 
  items, 
  onItemClick,
  align = 'left'
}) => {
  if (!isOpen) return null;
  
  return (
    <div 
      className={`${styles.dropdownMenu} ${isOpen ? styles.open : ''} ${align === 'right' ? styles.rightAligned : ''}`}
      role="menu"
      aria-orientation="vertical"
    >
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.id}
            className={styles.dropdownItem}
            role="menuitem"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => onItemClick(item)}
          >
            {Icon && <Icon className={styles.dropdownItemIcon} />}
            <span title={item.label} className={styles.itemText}>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default DropdownMenu;