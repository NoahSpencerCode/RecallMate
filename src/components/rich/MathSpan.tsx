import { Text } from 'react-native';

import { texToPlain } from '@/lib/rich';

/**
 * Native: math as readable Unicode (x², √x, H₂O) in the surrounding text style.
 * The web build typesets it with KaTeX instead (MathSpan.web.tsx).
 */
export function MathSpan({ tex }: { tex: string; display?: boolean }) {
  return <Text>{texToPlain(tex)}</Text>;
}
