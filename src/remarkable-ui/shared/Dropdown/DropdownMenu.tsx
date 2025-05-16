import React, { useRef, useEffect } from 'react';
import { DropdownItem } from './index';
import styles from './index.module.css';
import { handleItemKeyDown } from './handlers';

type DropdownMenuProps = {
  align?: 'left' | 'right';
  closeDropdown: () => void;
  isOpen: boolean;
  items: DropdownItem[];
  onItemClick: (item: DropdownItem) => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ 
  align = 'left',
  closeDropdown,
  isOpen, 
  items, 
  onItemClick,
}) => {

  const itemsRefs = useRef<Array<HTMLDivElement|null>>([]);

  useEffect(() => {
    if (isOpen) itemsRefs.current[0]?.focus()
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className={`${styles.dropdownMenu} ${isOpen ? styles.open : ''} ${align === 'right' ? styles.rightAligned : ''}`}
      role="menu"
      aria-orientation="vertical"
    >
      {items.map((item, i) => {
          const { id, icon: Icon, customContent, label } = item;
          const content = customContent ?? (
            <div className={styles.dropdownItemInnerDefault}>
              {Icon && <Icon className={styles.dropdownItemIcon} />}
              <span title={label} className={styles.itemText}>{label}</span>
            </div>
          );

          return (
            <div
              key={id}
              role="menuitem"
              tabIndex={-1}
              ref={el => { itemsRefs.current[i] = el; }}
              className={styles.dropdownItem}
              onKeyDown={e => handleItemKeyDown(e, i, itemsRefs, items, onItemClick, closeDropdown)}
              onMouseDown={e => e.stopPropagation()}
              onClick={() => onItemClick(item)}
            >
              {content}
            </div>
          );
        })}
    </div>
  );
};

export default DropdownMenu;