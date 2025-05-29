import { ActionIcon, useMantineColorScheme } from '@mantine/core';
import { Sun, Moon } from 'lucide-react';

const MenuPage = () => {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  return (
    <div>
      <h2>Menu Page</h2>
      <ActionIcon
        variant="outline"
        color={colorScheme === 'dark' ? 'yellow' : 'blue'}
        onClick={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}
        title="Toggle color scheme"
        size="xl"
        aria-label="Toggle color scheme"
      >
        {colorScheme === 'dark' ? (
          <Sun style={{ width: 18, height: 18 }} />
        ) : (
          <Moon style={{ width: 18, height: 18 }} />
        )}
      </ActionIcon>
    </div>
  );
};

export default MenuPage;
