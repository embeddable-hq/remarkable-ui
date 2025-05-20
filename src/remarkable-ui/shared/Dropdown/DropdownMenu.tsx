import React, { useState, useRef, useEffect } from 'react';

//Import Local Libraries
import { DropdownItem } from './index';
import styles from './index.module.css';
import { handleItemKeyDown } from './handlers';
import DropdownSearch from './DropdownSearch';

type DropdownMenuProps = {
  align?: 'left' | 'right';
  closeDropdown: () => void;
  isOpen: boolean;
  items: DropdownItem[];
  onItemClick: (item: DropdownItem) => void;
  onSearch?: (value: string) => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ 
  align = 'left',
  closeDropdown,
  isOpen, 
  items, 
  onItemClick,
  onSearch,
}) => {

  const [searchValue, setSearchValue] = useState<string>("");

  const itemsRefs = useRef<Array<HTMLDivElement|null>>([]);

  const itemsToRender = onSearch
    ? [{ id: 'dropdown-search', customContent: (
      <DropdownSearch 
        onSetSearchValue={setSearchValue} 
        searchValue={searchValue} 
        onSearch={onSearch}
      />
    )}, ...items] as DropdownItem[]
    : items;

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
      {itemsToRender.map((item, i) => {
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
              className={`${styles.dropdownItem} ${onSearch && i === 0 ? styles.searchMenuItem : ''}`}
              onKeyDown={e => handleItemKeyDown(e, i, itemsRefs, itemsToRender, onItemClick, closeDropdown)}
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