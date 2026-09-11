import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GuidelinesModal } from '../components/guidelines/GuidelinesModal';

describe('GuidelinesModal', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.style.overflow = '';
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(<GuidelinesModal isOpen={false} onClose={mockOnClose} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders modal with title and accessibility attributes when isOpen is true', () => {
    render(<GuidelinesModal isOpen={true} onClose={mockOnClose} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeDefined();
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(screen.getByText('Official Examination Guidelines')).toBeDefined();
  });

  it('displays key examination rule metrics (25 questions, 60/100 pass mark, 30 mins)', () => {
    render(<GuidelinesModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText('25 Qs')).toBeDefined();
    expect(screen.getByText('60 / 100')).toBeDefined();
    expect(screen.getByText('30 Mins')).toBeDefined();
    expect(screen.getByText('Min 15 Correct')).toBeDefined();
  });

  it('renders the official category breakdown table with 6 categories and grand total', () => {
    render(<GuidelinesModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText('Official Category Weightage (Syllabus Breakdown)')).toBeDefined();
    expect(screen.getByText('सवारी सञ्चालन सम्बन्धी ज्ञान')).toBeDefined();
    expect(screen.getByText('सवारी ऐन नियम सम्बन्धी ज्ञान')).toBeDefined();
    expect(screen.getByText('सवारी साधनको प्राविधिक तथा यान्त्रिक ज्ञान')).toBeDefined();
    expect(screen.getByText('वातावरण प्रदूषण सम्बन्धी अवधारणात्मक ज्ञान')).toBeDefined();
    expect(screen.getByText('दुर्घटना सचेतना सम्बन्धी ज्ञान')).toBeDefined();
    expect(screen.getByText('ट्राफिक सङ्केत सम्बन्धी ज्ञान')).toBeDefined();
    expect(screen.getByText('Grand Total:')).toBeDefined();
  });

  it('calls onClose when close icon button is clicked', () => {
    render(<GuidelinesModal isOpen={true} onClose={mockOnClose} />);

    const closeBtn = screen.getByLabelText('Close guidelines');
    fireEvent.click(closeBtn);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Got It footer button is clicked', () => {
    render(<GuidelinesModal isOpen={true} onClose={mockOnClose} />);

    const gotItBtn = screen.getByRole('button', { name: /Got It/i });
    fireEvent.click(gotItBtn);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    render(<GuidelinesModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when a key other than Escape is pressed', () => {
    render(<GuidelinesModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.keyDown(window, { key: 'Enter' });
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('calls onClose when clicking the backdrop overlay', () => {
    render(<GuidelinesModal isOpen={true} onClose={mockOnClose} />);

    const backdrop = screen.getByRole('dialog');
    fireEvent.click(backdrop);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('locks body scroll when opened and restores on unmount', () => {
    const { unmount } = render(<GuidelinesModal isOpen={true} onClose={mockOnClose} />);
    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).toBe('');
  });
});
