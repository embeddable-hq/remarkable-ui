import React, { useState, useRef, useEffect } from 'react';

//Import Local Libraries
import { DropdownItem } from './index';
import styles from './index.module.css';
import { handleItemKeyDown, handleSearchKeyDown, handleButtonKeyDown } from './handlers';
import SearchBar from './SearchBar';
import ApplyButton from './ApplyButton';

type DropdownMenuProps = {
  align?: 'left' | 'right';
  closeDropdown: () => void;
  isOpen: boolean;
  items: DropdownItem[];
  onItemClick: (item: DropdownItem) => void;
  onSearch?: (value: string) => void;
  onApply?: () => void;
  disableApply?: boolean;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ 
  align = 'left',
  closeDropdown,
  disableApply,
  isOpen, 
  items, 
  onApply,
  onItemClick,
  onSearch,
}) => {

  const menuRef = useRef<HTMLDivElement>(null);
  const [lockedWidth, setLockedWidth] = useState<number>();

  const itemsRefs = useRef<Array<HTMLDivElement|null>>([]);

  // when the menu opens, measure and lock its width
  useEffect(() => {
    if (isOpen && menuRef.current && lockedWidth == null) {
      const w = menuRef.current.getBoundingClientRect().width;
      setLockedWidth(w);
    }
  }, [isOpen, lockedWidth]);

  useEffect(() => {
    if (isOpen) itemsRefs.current[0]?.focus()
  }, [isOpen]);

  return (
    <div 
      ref={menuRef}
      className={`${styles.dropdownMenu} ${isOpen ? styles.open : ''} ${align === 'right' ? styles.rightAligned : ''}`}
      role="menu"
      style={lockedWidth ? { width: lockedWidth } : undefined}
      aria-orientation="vertical"
    >
      {onSearch
        && (          
          <SearchBar 
            onSearch={onSearch}
            onKeyDown={(e) => handleSearchKeyDown(e, itemsRefs)}
          />
        )
      }      
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
      {onApply 
        && (
          <ApplyButton
            handleButtonKeyDown={(e) => handleButtonKeyDown(e, itemsRefs, items, onApply)}
            onApply={onApply}
            disableApply={disableApply} 
          />
        )
      }      
    </div>
  );
};

export default DropdownMenu;