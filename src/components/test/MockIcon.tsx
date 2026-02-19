import { IconProps } from '@tabler/icons-react';

export const MockIcon = (props: IconProps) => (
  <svg data-testid="mock-icon" {...(props as React.SVGProps<SVGSVGElement>)} />
);
