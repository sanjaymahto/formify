import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CardSectionProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const CardSection: React.FC<CardSectionProps> = ({
  title,
  children,
  icon,
  className = '',
}) => (
  <Card className={className}>
    <CardHeader>
      <CardTitle className={icon ? 'flex items-center space-x-2 text-sm' : 'text-sm'}>
        {icon && icon}
        <span>{title}</span>
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {children}
    </CardContent>
  </Card>
); 