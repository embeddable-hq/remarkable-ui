type ConditionalWrapperProps = {
  condition: boolean;
  wrapper: (children: React.ReactNode) => React.ReactNode;
  children: React.ReactNode;
};

export const ConditionalWrapper: React.FC<ConditionalWrapperProps> = ({
  condition,
  wrapper,
  children,
}) => (condition ? wrapper(children) : <>{children}</>);
