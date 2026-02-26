import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SingleSelectField } from './SingleSelectField';
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
  await user.click(screen.getByRole('button', { name: /select option$/i }));
};

describe('SingleSelectField', () => {
  describe('rendering', () => {
    it('renders the trigger button', () => {
      render(<SingleSelectField options={OPTIONS} onChange={vi.fn()} />);

      expect(screen.getByRole('button', { name: /select option$/i })).toBeInTheDocument();
    });

    it('shows the default placeholder when no value is provided', () => {
      render(<SingleSelectField options={OPTIONS} onChange={vi.fn()} />);

      expect(screen.getByText('Select')).toBeInTheDocument();
    });

    it('shows a custom placeholder', () => {
      render(
        <SingleSelectField options={OPTIONS} placeholder="Choose an item" onChange={vi.fn()} />,
      );

      expect(screen.getByText('Choose an item')).toBeInTheDocument();
    });

    it('renders the field label', () => {
      render(<SingleSelectField options={OPTIONS} label="Item" onChange={vi.fn()} />);

      expect(screen.getByText('Item')).toBeInTheDocument();
    });

    it('shows the selected option label when a value is provided', () => {
      render(<SingleSelectField options={OPTIONS} value="apple" onChange={vi.fn()} />);

      expect(screen.getByText('Apple')).toBeInTheDocument();
    });

    it('shows the error message', () => {
      render(
        <SingleSelectField
          options={OPTIONS}
          errorMessage="This field is required"
          onChange={vi.fn()}
        />,
      );

      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('does not show the dropdown initially', () => {
      render(<SingleSelectField options={OPTIONS} onChange={vi.fn()} />);

      expect(screen.queryByText('Apple')).not.toBeInTheDocument();
    });

    it('renders with a start icon', () => {
      render(<SingleSelectField options={OPTIONS} startIcon={MockIcon} onChange={vi.fn()} />);

      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });
  });

  describe('dropdown', () => {
    it('opens when the trigger is clicked', async () => {
      const user = userEvent.setup();
      render(<SingleSelectField options={OPTIONS} onChange={vi.fn()} />);

      await openDropdown(user);

      expect(screen.getByText('Apple')).toBeInTheDocument();
    });

    it('does not open when disabled', async () => {
      const user = userEvent.setup();
      render(<SingleSelectField options={OPTIONS} disabled onChange={vi.fn()} />);

      await openDropdown(user);

      expect(screen.queryByText('Apple')).not.toBeInTheDocument();
    });

    it('renders all options', async () => {
      const user = userEvent.setup();
      render(<SingleSelectField options={OPTIONS} onChange={vi.fn()} />);

      await openDropdown(user);

      expect(screen.getByText('Apple')).toBeInTheDocument();
      expect(screen.getByText('Banana')).toBeInTheDocument();
      expect(screen.getByText('Cherry')).toBeInTheDocument();
    });

    it('shows the no options message when options is empty', async () => {
      const user = userEvent.setup();
      render(
        <SingleSelectField options={[]} noOptionsMessage="No items available" onChange={vi.fn()} />,
      );

      await openDropdown(user);

      expect(screen.getByText('No items available')).toBeInTheDocument();
    });

    it('renders category headers for grouped options', async () => {
      const user = userEvent.setup();
      render(<SingleSelectField options={CATEGORY_OPTIONS} onChange={vi.fn()} />);

      await openDropdown(user);

      expect(screen.getByText('Fruit')).toBeInTheDocument();
      expect(screen.getByText('Vegetable')).toBeInTheDocument();
    });
  });

  describe('onChange', () => {
    it('calls onChange when an option is selected', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<SingleSelectField options={OPTIONS} onChange={handleChange} />);

      await openDropdown(user);
      await user.click(screen.getByText('Apple'));

      expect(handleChange).toHaveBeenCalledOnce();
      expect(handleChange).toHaveBeenCalledWith('apple');
    });

    it('calls onChange with an empty string when the clear button is clicked', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <SingleSelectField options={OPTIONS} value="apple" clearable onChange={handleChange} />,
      );

      const trigger = screen.getByRole('button', { name: /select option$/i });
      const clearIcon = trigger.querySelectorAll('svg')[0];
      await user.pointer({ target: clearIcon, keys: '[MouseLeft>]' });

      expect(handleChange).toHaveBeenCalledWith('');
    });
  });

  describe('search', () => {
    it('shows the search field when searchable', async () => {
      const user = userEvent.setup();
      render(<SingleSelectField options={OPTIONS} searchable onChange={vi.fn()} />);

      await openDropdown(user);

      expect(screen.getByRole('searchbox', { name: /search options/i })).toBeInTheDocument();
    });

    it('does not show the search field when not searchable', async () => {
      const user = userEvent.setup();
      render(<SingleSelectField options={OPTIONS} onChange={vi.fn()} />);

      await openDropdown(user);

      expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
    });

    it('filters options based on search input', async () => {
      const user = userEvent.setup();
      render(<SingleSelectField options={OPTIONS} searchable onChange={vi.fn()} />);

      await openDropdown(user);
      await user.type(screen.getByRole('searchbox'), 'app');

      expect(screen.getByText('Apple')).toBeInTheDocument();
      expect(screen.queryByText('Banana')).not.toBeInTheDocument();
    });

    it('calls onSearch when typing in the search field', async () => {
      const user = userEvent.setup();
      const handleSearch = vi.fn();
      render(
        <SingleSelectField
          options={OPTIONS}
          searchable
          onSearch={handleSearch}
          onChange={vi.fn()}
        />,
      );

      await openDropdown(user);
      await user.type(screen.getByRole('searchbox'), 'app');

      expect(handleSearch).toHaveBeenCalled();
    });
  });
});
