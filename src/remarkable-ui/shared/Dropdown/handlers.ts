import { DropdownItem } from './index';

export const handleItemKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>, 
    i: number,
    itemsRefs: React.RefObject<Array<HTMLDivElement | null>>,
    items: DropdownItem[],
    onItemClick: (item: DropdownItem) => void,
    closeDropdown: () => void
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