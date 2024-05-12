import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Page from '@/app/page'

describe('Ladning Page', () => {
    it('Renders the landing page', () => {
        render(<Page />)

        const heading = screen.getByRole('heading', { level: 1 });

        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent('Thank you for your some fun quizes');
    });

    it("Renders the links and navigates to the correct page", () => {
        render(<Page />);

        const firstQuestionLink = screen.getByTestId("auto-delete");
        const secondQuestionLink = screen.getByTestId("department");

        expect(firstQuestionLink).toBeInTheDocument();
        expect(secondQuestionLink).toBeInTheDocument();
    });
})