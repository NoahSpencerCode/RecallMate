import { TabList, TabSlot, TabTrigger, Tabs } from 'expo-router/ui';
import { StyleSheet } from 'react-native';

import { FloatingTabBar, NavButton, Sidebar } from '@/components/navigation/AppNav';
import { useIsWide } from '@/theme';

const TABS = [
  { name: 'index', href: '/', label: 'Today', icon: 'home-variant' },
  { name: 'library', href: '/library', label: 'Library', icon: 'cards-outline' },
  { name: 'learn', href: '/learn', label: 'Learn', icon: 'school-outline' },
  { name: 'progress', href: '/progress', label: 'Progress', icon: 'chart-timeline-variant' },
] as const;

export default function TabsLayout() {
  const isWide = useIsWide();
  const variant = isWide ? 'sidebar' : 'bar';
  const triggers = TABS.map((tab) => (
    <TabTrigger key={tab.name} name={tab.name} href={tab.href} asChild>
      <NavButton icon={tab.icon} label={tab.label} variant={variant} />
    </TabTrigger>
  ));

  return (
    <Tabs style={[styles.root, isWide && styles.wide]}>
      {isWide ? (
        <TabList asChild>
          <Sidebar>{triggers}</Sidebar>
        </TabList>
      ) : null}
      <TabSlot style={styles.root} />
      {!isWide ? (
        <TabList asChild>
          <FloatingTabBar>{triggers}</FloatingTabBar>
        </TabList>
      ) : null}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  wide: { flexDirection: 'row' },
});
