import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MultiSelectField } from './MultiSelectField';
import { MockIcon } from '../../../test/MockIcon';

vi.mock('../../../../utils/debounce.utils', () => ({
  debounce: <T extends (...args: unknown[]) => void>(fn: T) => fn,
}));

const OPTIONS = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
];

const CATEGORY_OPTIONS = [
  { value: 'apple', label: 'Apple', category: 'Fruit' },
  { value: 'carrot', label: 'Carrot', category: 'Vegetable' },
];

const openDropdown = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole('button', { name: /select options/i }));
};

describe('MultiSelectField', () => {
  describe('rendering', () => {
    it('renders the trigger button', () => {
      render(<MultiSelectField options={OPTIONS} onChange={vi.fn()} />);

      expect(screen.getByRole('button', { name: /select options/i })).toBeInTheDocument();
    });

    it('shows the default placeholder when no value is provided', () => {
      render(<MultiSelectField options={OPTIONS} onChange={vi.fn()} />);

      expect(screen.getByText('Select')).toBeInTheDocument();
    });

    it('shows a custom placeholder', () => {
      render(<MultiSelectField options={OPTIONS} placeholder="Choose items" onChange={vi.fn()} />);

      expect(screen.getByText('Choose items')).toBeInTheDocument();
    });

    it('renders the field label', () => {
      render(<MultiSelectField options={OPTIONS} label="Items" onChange={vi.fn()} />);

      expect(screen.getByText('Items')).toBeInTheDocument();
    });

    it('shows the selected values label when values are provided', () => {
      render(
        <MultiSelectField options={OPTIONS} values={['apple', 'banana']} onChange={vi.fn()} />,
      );

      expect(screen.getByText('(2) Apple, Banana')).toBeInTheDocument();
    });

    it('shows the error message', () => {
      render(
        <MultiSelectField
          options={OPTIONS}
          errorMessage="This field is required"
          onChange={vi.fn()}
        />,
      );

      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('does not show the dropdown initially', () => {
      render(<MultiSelectField options={OPTIONS} onChange={vi.fn()} />);

      expect(screen.queryByRole('button', { name: 'Apply' })).not.toBeInTheDocument();
    });

    it('renders with a start icon', () => {
      render(<MultiSelectField options={OPTIONS} startIcon={MockIcon} onChange={vi.fn()} />);

      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });
  });

  describe('dropdown', () => {
    it('opens when the trigger is clicked', async () => {
      const user = userEvent.setup();
      render(<MultiSelectField options={OPTIONS} onChange={vi.fn()} />);

      await openDropdown(user);

      expect(screen.getByText('Apple')).toBeInTheDocument();
    });

    it('does not open when disabled', async () => {
      const user = userEvent.setup();
      render(<MultiSelectField options={OPTIONS} disabled onChange={vi.fn()} />);

      await openDropdown(user);

      expect(screen.queryByText('Apple')).not.toBeInTheDocument();
    });

    it('shows the Apply button inside the dropdown', async () => {
      const user = userEvent.setup();
      render(<MultiSelectField options={OPTIONS} onChange={vi.fn()} />);

      await openDropdown(user);

      expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument();
    });

    it('shows a custom submitLabel', async () => {
      const user = userEvent.setup();
      render(<MultiSelectField options={OPTIONS} submitLabel="Confirm" onChange={vi.fn()} />);

      await openDropdown(user);

      expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    });

    it('shows the search field when isSearchable', async () => {
      const user = userEvent.setup();
      render(<MultiSelectField options={OPTIONS} isSearchable onChange={vi.fn()} />);

      await openDropdown(user);

      expect(screen.getByRole('searchbox', { name: /search options/i })).toBeInTheDocument();
    });

    it('does not show the search field when not isSearchable', async () => {
      const user = userEvent.setup();
      render(<MultiSelectField options={OPTIONS} onChange={vi.fn()} />);

      await openDropdown(user);

      expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
    });
  });

  describe('options', () => {
    it('renders all options', async () => {
      const user = userEvent.setup();
      render(<MultiSelectField options={OPTIONS} onChange={vi.fn()} />);

      await openDropdown(user);

      expect(screen.getByText('Apple')).toBeInTheDocument();
      expect(screen.getByText('Banana')).toBeInTheDocument();
      expect(screen.getByText('Cherry')).toBeInTheDocument();
    });

    it('shows the no options message when displayOptions is empty', async () => {
      const user = userEvent.setup();
      render(
        <MultiSelectField options={[]} noOptionsMessage="No items available" onChange={vi.fn()} />,
      );

      await openDropdown(user);

      expect(screen.getByText('No items available')).toBeInTheDocument();
    });

    it('renders category headers for grouped options', async () => {
      const user = userEvent.setup();
      render(<MultiSelectField options={CATEGORY_OPTIONS} onChange={vi.fn()} />);

      await openDropdown(user);

      expect(screen.getByText('Fruit')).toBeInTheDocument();
      expect(screen.getByText('Vegetable')).toBeInTheDocument();
    });
  });

  describe('Apply button', () => {
    it('is disabled when no options are selected', async () => {
      const user = userEvent.setup();
      render(<MultiSelectField options={OPTIONS} onChange={vi.fn()} />);

      await openDropdown(user);

      expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled();
    });

    it('is disabled when selection matches the current values', async () => {
      const user = userEvent.setup();
      render(<MultiSelectField options={OPTIONS} values={['apple']} onChange={vi.fn()} />);

      await openDropdown(user);

      expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled();
    });

    it('becomes enabled after selecting an option', async () => {
      const user = userEvent.setup();
      render(<MultiSelectField options={OPTIONS} onChange={vi.fn()} />);

      await openDropdown(user);
      await user.click(screen.getByText('Apple'));

      expect(screen.getByRole('button', { name: 'Apply' })).toBeEnabled();
    });

    it('becomes enabled after deselecting an option', async () => {
      const user = userEvent.setup();
      render(<MultiSelectField options={OPTIONS} values={['apple']} onChange={vi.fn()} />);

      await openDropdown(user);
      await user.click(screen.getByText('Apple'));

      expect(screen.getByRole('button', { name: 'Apply' })).toBeEnabled();
    });

    it('is disabled when disableApplyButton is true', async () => {
      const user = userEvent.setup();
      render(
        <MultiSelectField
          options={OPTIONS}
          values={['apple']}
          disableApplyButton
          onChange={vi.fn()}
        />,
      );

      await openDropdown(user);

      expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled();
    });

    it('stays disabled when disableApplyButton is true even after pending change', async () => {
      const user = userEvent.setup();
      render(
        <MultiSelectField
          options={OPTIONS}
          values={['apple']}
          disableApplyButton
          onChange={vi.fn()}
        />,
      );

      await openDropdown(user);
      await user.click(screen.getByText('Banana'));

      expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled();
    });

    it('is enabled when disableApplyButton is false and there is a pending change', async () => {
      const user = userEvent.setup();
      render(
        <MultiSelectField
          options={OPTIONS}
          values={['apple']}
          disableApplyButton={false}
          onChange={vi.fn()}
        />,
      );

      await openDropdown(user);
      await user.click(screen.getByText('Apple'));

      expect(screen.getByRole('button', { name: 'Apply' })).toBeEnabled();
    });
  });

  describe('onChange', () => {
    it('calls onChange with the selected values when Apply is clicked', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<MultiSelectField options={OPTIONS} onChange={handleChange} />);

      await openDropdown(user);
      await user.click(screen.getByText('Apple'));
      await user.click(screen.getByText('Banana'));
      await user.click(screen.getByRole('button', { name: 'Apply' }));

      expect(handleChange).toHaveBeenCalledOnce();
      expect(handleChange).toHaveBeenCalledWith(['apple', 'banana']);
    });

    it('closes the dropdown after Apply is clicked', async () => {
      const user = userEvent.setup();
      render(<MultiSelectField options={OPTIONS} onChange={vi.fn()} />);

      await openDropdown(user);
      await user.click(screen.getByText('Apple'));
      await user.click(screen.getByRole('button', { name: 'Apply' }));

      expect(screen.queryByRole('button', { name: 'Apply' })).not.toBeInTheDocument();
    });

    it('does not call onChange when the dropdown is closed without applying', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<MultiSelectField options={OPTIONS} onChange={handleChange} />);

      await openDropdown(user);
      await user.click(screen.getByText('Apple'));
      await user.keyboard('{Escape}');

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('calls onChange with an empty array when the clear button is clicked', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <MultiSelectField
          options={OPTIONS}
          values={['apple']}
          isClearable
          onChange={handleChange}
        />,
      );

      const trigger = screen.getByRole('button', { name: /select options/i });
      const clearIcon = trigger.querySelectorAll('svg')[0];
      await user.pointer({ target: clearIcon, keys: '[MouseLeft>]' });

      expect(handleChange).toHaveBeenCalledWith([]);
    });
  });

  describe('search', () => {
    it('filters options based on search input', async () => {
      const user = userEvent.setup();
      render(<MultiSelectField options={OPTIONS} isSearchable onChange={vi.fn()} />);

      await openDropdown(user);
      await user.type(screen.getByRole('searchbox'), 'app');

      expect(screen.getByText('Apple')).toBeInTheDocument();
      expect(screen.queryByText('Banana')).not.toBeInTheDocument();
    });

    it('calls onSearch when typing in the search field', async () => {
      const user = userEvent.setup();
      const handleSearch = vi.fn();
      render(
        <MultiSelectField
          options={OPTIONS}
          isSearchable
          onSearch={handleSearch}
          onChange={vi.fn()}
        />,
      );

      await openDropdown(user);
      await user.type(screen.getByRole('searchbox'), 'app');

      expect(handleSearch).toHaveBeenCalled();
    });
  });

  describe('onPendingChange', () => {
    it('calls onPendingChange with values when values prop is provided', () => {
      const handlePendingChange = vi.fn();
      render(
        <MultiSelectField
          options={OPTIONS}
          values={['apple', 'banana']}
          onPendingChange={handlePendingChange}
          onChange={vi.fn()}
        />,
      );

      expect(handlePendingChange).toHaveBeenCalledWith(['apple', 'banana']);
    });

    it('calls onPendingChange when user selects an option', async () => {
      const user = userEvent.setup();
      const handlePendingChange = vi.fn();
      render(
        <MultiSelectField
          options={OPTIONS}
          values={['apple']}
          onPendingChange={handlePendingChange}
          onChange={vi.fn()}
        />,
      );

      await openDropdown(user);
      handlePendingChange.mockClear();
      await user.click(screen.getByText('Banana'));

      expect(handlePendingChange).toHaveBeenCalledWith(['apple', 'banana']);
    });

    it('calls onPendingChange when user deselects an option', async () => {
      const user = userEvent.setup();
      const handlePendingChange = vi.fn();
      render(
        <MultiSelectField
          options={OPTIONS}
          values={['apple']}
          onPendingChange={handlePendingChange}
          onChange={vi.fn()}
        />,
      );

      await openDropdown(user);
      handlePendingChange.mockClear();
      await user.click(screen.getByText('Apple'));

      expect(handlePendingChange).toHaveBeenCalledWith([]);
    });
  });
});
