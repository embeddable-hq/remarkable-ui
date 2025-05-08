import React, { useRef, useEffect } from 'react';
import { DropdownItem } from './index';
import styles from './index.module.css';

type DropdownMenuProps = {
  isOpen: boolean;
  items: DropdownItem[];
  onItemClick: (item: DropdownItem) => void;
  closeDropdown: () => void;
  align?: 'left' | 'right';
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ 
  align = 'left',
  closeDropdown,
  isOpen, 
  items, 
  onItemClick,
}) => {
  if (!isOpen) return null;

  useEffect(() => {
    if (isOpen) itemsRefs.current[0]?.focus()
  }, [isOpen])

  const itemsRefs = useRef<Array<HTMLDivElement|null>>([]);

  const handleItemKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>, 
    i: number
  ) => {

    // Prevent default behavior for arrow keys (e.g. scrolling)
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
    }

    switch (e.key) {
      case 'ArrowDown':
        return itemsRefs.current[(i+1)%items.length]?.focus();
      case 'ArrowUp':
        return itemsRefs.current[(i-1+items.length)%items.length]?.focus();
      case 'Enter': case ' ':
        onItemClick(items[i]);
        break;
      case 'Escape':
        closeDropdown();
        break;
    }
  }

  const handleTriggerKeyDown = (e: KeyboardEvent) => {
    if (e.key==='Enter'||e.key===' ') {
      e.preventDefault();
      // setIsOpen(o=>!o);
    }
  }
  
  return (
    <div 
      className={`${styles.dropdownMenu} ${isOpen ? styles.open : ''} ${align === 'right' ? styles.rightAligned : ''}`}
      role="menu"
      aria-orientation="vertical"
    >
      {items.map((item, i) => {
        const Icon = item.icon;

        return (
          <div
            role="menuitem"
            tabIndex={-1}
            ref={el => { itemsRefs.current[i] = el; }}
            key={item.id}
            className={styles.dropdownItem}
            onKeyDown={e => handleItemKeyDown(e, i)}
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