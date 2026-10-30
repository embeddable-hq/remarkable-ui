import { useContext, useId, useMemo } from 'react';
import { CardContext } from '../shared/Card/CardContext';

/**
 * Accessibility attributes for a chart canvas (react-chartjs-2 already sets role="img").
 *
 * Name: `ariaLabel` prop, else the enclosing Card's title, else `defaultLabel`.
 * Description: `ariaDescription` prop, else the generated summary.
 */
export const useChartA11y = ({
  ariaLabel,
  ariaDescription,
  defaultLabel,
  getSummary,
  summaryDeps,
}: {
  ariaLabel?: string;
  ariaDescription?: string;
  defaultLabel: string;
  getSummary: () => string;
  summaryDeps: unknown[];
}) => {
  const descriptionId = useId();
  const { titleId } = useContext(CardContext);

  const summary = useMemo(
    () => ariaDescription ?? getSummary(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ariaDescription, ...summaryDeps],
  );

  return {
    canvasProps: {
      'aria-label': ariaLabel ?? defaultLabel,
      // Takes precedence over aria-label; ignored by browsers when the id doesn't resolve
      'aria-labelledby': ariaLabel ? undefined : titleId,
      'aria-describedby': summary ? descriptionId : undefined,
    },
    // `hidden` still works as an aria-describedby target
    description: summary ? (
      <p id={descriptionId} hidden>
        {summary}
      </p>
    ) : null,
  };
};
