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

const openDropdown = async (
  user: ReturnType<typeof userEvent.setup>,
  name: string | RegExp = /^select$/i,
) => {
  await user.click(screen.getByRole('button', { name }));
};

describe('SingleSelectField', () => {
  describe('rendering', () => {
    it('renders the trigger button', () => {
      render(<SingleSelectField options={OPTIONS} onChange={vi.fn()} />);

      expect(screen.getByRole('button', { name: /^select$/i })).toBeInTheDocument();
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

      await user.click(screen.getByRole('button', { name: 'Clear' }));

      expect(handleChange).toHaveBeenCalledWith(null);
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

describe('SingleSelectField accessible naming', () => {
  const options = [{ value: 'a', label: 'Alpha' }];

  it('names the trigger from the visible label and current value', () => {
    render(<SingleSelectField label="Country" options={options} value="a" onChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: /Country\s+Alpha/ })).toBeInTheDocument();
  });

  it('exposes required once, via aria-required, not in the accessible name', () => {
    render(
      <SingleSelectField label="Country" required options={options} value="a" onChange={vi.fn()} />,
    );

    const trigger = screen.getByRole('button', { name: /Country/ });
    expect(trigger).toHaveAccessibleName(/^Country\s+Alpha$/);
    expect(trigger).toHaveAttribute('aria-required', 'true');
  });

  it('uses ariaLabel when there is no visible label', () => {
    render(<SingleSelectField ariaLabel="Region" options={options} onChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Region' })).toBeInTheDocument();
  });

  it('links the error message to the trigger', () => {
    render(
      <SingleSelectField
        label="Country"
        options={options}
        errorMessage="Required"
        onChange={vi.fn()}
      />,
    );

    const trigger = screen.getByRole('button', { name: /Country/ });
    expect(trigger).toHaveAttribute('aria-invalid', 'true');
    expect(trigger).toHaveAccessibleDescription('Required');
  });
});
