import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';

export type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

type IconProps = {
  name: IconName;
  size?: number;
  color: string;
};

export function Icon({ name, size = 22, color }: IconProps) {
  return <MaterialCommunityIcons name={name} size={size} color={color} />;
}
