import { DropdownItem } from './index';

export const handleItemKeyDown = (
	e: React.KeyboardEvent<HTMLDivElement>,
	i: number,
	itemsRefs: React.RefObject<Array<HTMLDivElement | null>>,
	items: DropdownItem[],
	onItemClick: (item: DropdownItem) => void,
	closeDropdown: () => void,
) => {
	// Prevent default behavior for arrow keys (e.g. scrolling)
	if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
		e.preventDefault();
	}

	switch (e.key) {
		case 'ArrowDown':
			return itemsRefs.current[(i + 1) % items.length]?.focus();
		case 'ArrowUp':
			return itemsRefs.current[(i - 1 + items.length) % items.length]?.focus();
		case 'Enter':
		case ' ':
			onItemClick(items[i]);
			break;
		case 'Escape':
			closeDropdown();
			break;
	}
};

export const handleSearchKeyDown = (
	e: React.KeyboardEvent,
	itemsRefs: React.RefObject<Array<HTMLDivElement | null>>,
) => {
	if ((e.key === 'Tab' && !e.shiftKey) || e.key === 'ArrowDown') {
		e.preventDefault();
		itemsRefs.current[0]?.focus();
	}
};

export const handleButtonKeyDown = (
	e: React.KeyboardEvent<HTMLButtonElement>,
	itemsRefs: React.RefObject<Array<HTMLDivElement | null>>,
	items: DropdownItem[],
	onApply: () => void,
) => {
	// when ApplyButton is focused, Enter or Space should fire onApply
	if (e.key === 'Enter' || e.key === ' ') {
		e.preventDefault();
		onApply();
	}
	if (e.key === 'ArrowUp') {
		// move focus back to last item
		e.preventDefault();
		itemsRefs.current[items.length - 1]?.focus();
	}
};
