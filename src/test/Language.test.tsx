import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '../context/LanguageContext';
import { LanguageModal } from '../components/language/LanguageModal';
import { Navbar } from '../components/layout/Navbar';
import { ThemeProvider } from '../context/ThemeContext';
import questionsNe from '../../public/data/questions_ne.json';

// Test consumer component
const TestLanguageConsumer = () => {
  const { language, setLanguage, t, hasChosenLanguage } = useLanguage();
  return (
    <div>
      <span data-testid="current-lang">{language}</span>
      <span data-testid="has-chosen">{hasChosenLanguage ? 'true' : 'false'}</span>
      <span data-testid="translated-tab">{t('tabLearn')}</span>
      <button onClick={() => setLanguage('ne')} data-testid="btn-set-ne">
        Set Ne
      </button>
      <button onClick={() => setLanguage('en')} data-testid="btn-set-en">
        Set En
      </button>
    </div>
  );
};

describe('Language System & Nepali Questions', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('validates public/data/questions_ne.json contains exactly 500 valid Nepali questions', () => {
    expect(questionsNe.questions.length).toBe(500);
    expect(questionsNe.categories.length).toBe(6);
    expect(questionsNe.metadata.totalQuestions).toBe(500);

    // Verify first question
    const q1 = questionsNe.questions[0];
    expect(q1.id).toBe(1);
    expect(q1.question).toContain('जेब्रा क्रसिङ');
    expect(q1.options.length).toBe(4);
    expect(q1.correctAnswer).toBe('B');

    // Verify traffic signs questions (416-500)
    const q416 = questionsNe.questions[415];
    expect(q416.id).toBe(416);
    expect(q416.image).toBe('/signs/sign_416.png');
    expect(q416.options.length).toBe(4);
  });

  it('switches languages and provides localized translations via LanguageProvider', () => {
    render(
      <LanguageProvider>
        <TestLanguageConsumer />
      </LanguageProvider>
    );

    // Initial state (defaults to 'en' in test)
    expect(screen.getByTestId('current-lang').textContent).toBe('en');
    expect(screen.getByTestId('translated-tab').textContent).toBe('Learn');

    // Switch to Nepali
    fireEvent.click(screen.getByTestId('btn-set-ne'));
    expect(screen.getByTestId('current-lang').textContent).toBe('ne');
    expect(screen.getByTestId('translated-tab').textContent).toBe('सिक्नुहोस्');

    // Verify persistence in localStorage
    expect(localStorage.getItem('license_prep_language')).toBe('ne');

    // Switch back to English
    fireEvent.click(screen.getByTestId('btn-set-en'));
    expect(screen.getByTestId('current-lang').textContent).toBe('en');
    expect(screen.getByTestId('translated-tab').textContent).toBe('Learn');
    expect(localStorage.getItem('license_prep_language')).toBe('en');
  });

  it('renders LanguageModal when explicitly open or not chosen, and saves selection', () => {
    render(
      <LanguageProvider>
        <LanguageModal isOpen={true} />
        <TestLanguageConsumer />
      </LanguageProvider>
    );

    // Modal title should be visible
    expect(screen.getByText('Choose Exam Language')).toBeDefined();
    expect(screen.getByText('आफ्नो परीक्षा भाषा छान्नुहोस्')).toBeDefined();

    // Click Nepali card
    const nepaliBtn = screen.getByText('नेपाली (Nepali)').closest('button');
    expect(nepaliBtn).toBeDefined();
    if (nepaliBtn) {
      fireEvent.click(nepaliBtn);
    }

    // Language state should now be Nepali
    expect(screen.getByTestId('current-lang').textContent).toBe('ne');
    expect(localStorage.getItem('license_prep_language')).toBe('ne');
    expect(localStorage.getItem('license_prep_has_chosen_lang')).toBe('true');
  });

  it('Navbar language toggle buttons switch language immediately', () => {
    const onSelectTab = vi.fn();
    const onOpenGuidelines = vi.fn();

    render(
      <ThemeProvider>
        <LanguageProvider>
          <Navbar
            activeTab="learn"
            onSelectTab={onSelectTab}
            onOpenGuidelines={onOpenGuidelines}
          />
          <TestLanguageConsumer />
        </LanguageProvider>
      </ThemeProvider>
    );

    // Click Nepali switch in Navbar
    const neSwitch = screen.getByTestId('lang-switch-ne');
    fireEvent.click(neSwitch);

    expect(screen.getByTestId('current-lang').textContent).toBe('ne');
    expect(screen.getByText('नेपाल सवारी लाइसेन्स तयारी')).toBeDefined();

    // Click English switch in Navbar
    const enSwitch = screen.getByTestId('lang-switch-en');
    fireEvent.click(enSwitch);

    expect(screen.getByTestId('current-lang').textContent).toBe('en');
    expect(screen.getByText('Nepal License Prep')).toBeDefined();
  });
});
