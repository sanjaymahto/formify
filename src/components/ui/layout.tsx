import React from 'react';

interface FlexRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const FlexRow: React.FC<FlexRowProps> = ({
  children,
  className = '',
  onClick,
}) => (
  <div className={`flex items-center space-x-2 ${className}`} onClick={onClick}>
    {children}
  </div>
);

interface FlexColProps {
  children: React.ReactNode;
  className?: string;
}

export const FlexCol: React.FC<FlexColProps> = ({
  children,
  className = '',
}) => <div className={`flex flex-col space-y-2 ${className}`}>{children}</div>;

interface Grid2ColProps {
  children: React.ReactNode;
  className?: string;
}

export const Grid2Col: React.FC<Grid2ColProps> = ({
  children,
  className = '',
}) => <div className={`grid grid-cols-2 gap-4 ${className}`}>{children}</div>;

interface SpaceYProps {
  children: React.ReactNode;
  className?: string;
}

export const SpaceY: React.FC<SpaceYProps> = ({ children, className = '' }) => (
  <div className={`space-y-2 ${className}`}>{children}</div>
);
