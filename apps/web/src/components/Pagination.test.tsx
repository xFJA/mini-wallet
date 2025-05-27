import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Pagination, { PaginationProps } from './Pagination';

describe('<Pagination /> component', () => {
  const setup = (props: Partial<PaginationProps> = {}) => {
    const onPageChange = vi.fn();
    const defaultProps: PaginationProps = {
      currentPage: 2,
      totalPages: 5,
      onPageChange,
      ...props,
    };
    render(<Pagination {...defaultProps} />);
    return { onPageChange };
  };

  it('renders nothing if totalPages is 1 or less', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders previous and next buttons', () => {
    setup();
    expect(screen.getByLabelText(/previous page/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/next page/i)).toBeInTheDocument();
  });

  it('calls onPageChange with correct page when next/prev clicked', () => {
    const { onPageChange } = setup({ currentPage: 2 });
    fireEvent.click(screen.getByLabelText(/previous page/i));
    expect(onPageChange).toHaveBeenCalledWith(1);
    fireEvent.click(screen.getByLabelText(/next page/i));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('disables prev button on first page', () => {
    setup({ currentPage: 1 });
    expect(screen.getByLabelText(/previous page/i)).toBeDisabled();
  });

  it('disables next button on last page', () => {
    setup({ currentPage: 5, totalPages: 5 });
    expect(screen.getByLabelText(/next page/i)).toBeDisabled();
  });

  it('shows correct page buttons', () => {
    setup({ currentPage: 3, totalPages: 5 });
    expect(screen.getByText('3')).toHaveClass('bg-blue-600');
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('calls onPageChange when a page number is clicked', () => {
    const { onPageChange } = setup({ currentPage: 2 });
    fireEvent.click(screen.getByText('3'));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });
});
