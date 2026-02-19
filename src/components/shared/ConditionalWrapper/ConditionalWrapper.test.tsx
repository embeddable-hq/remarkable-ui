import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ConditionalWrapper from './ConditionalWrapper';

describe('ConditionalWrapper', () => {
  it('wraps children when condition is true', () => {
    render(
      <ConditionalWrapper
        condition={true}
        wrapper={(children) => <section data-testid="wrapper">{children}</section>}
      >
        <span>Content</span>
      </ConditionalWrapper>,
    );

    expect(screen.getByTestId('wrapper')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders children without wrapper when condition is false', () => {
    render(
      <ConditionalWrapper
        condition={false}
        wrapper={(children) => <section data-testid="wrapper">{children}</section>}
      >
        <span>Content</span>
      </ConditionalWrapper>,
    );

    expect(screen.queryByTestId('wrapper')).not.toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('passes children to the wrapper function', () => {
    render(
      <ConditionalWrapper condition={true} wrapper={(children) => <a href="/link">{children}</a>}>
        <span>Link text</span>
      </ConditionalWrapper>,
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/link');
    expect(link).toHaveTextContent('Link text');
  });

  it('renders multiple children correctly when condition is false', () => {
    render(
      <ConditionalWrapper
        condition={false}
        wrapper={(children) => <div data-testid="wrapper">{children}</div>}
      >
        <span>First</span>
        <span>Second</span>
      </ConditionalWrapper>,
    );

    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  it('renders multiple children correctly when condition is true', () => {
    render(
      <ConditionalWrapper
        condition={true}
        wrapper={(children) => <div data-testid="wrapper">{children}</div>}
      >
        <span>First</span>
        <span>Second</span>
      </ConditionalWrapper>,
    );

    const wrapper = screen.getByTestId('wrapper');
    expect(wrapper).toHaveTextContent('First');
    expect(wrapper).toHaveTextContent('Second');
  });
});
