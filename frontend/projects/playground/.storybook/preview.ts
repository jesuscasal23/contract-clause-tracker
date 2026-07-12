import type { Preview } from '@storybook/angular';
import { setCompodocJson } from '@storybook/addon-docs/angular';
import docJson from '../documentation.json';
setCompodocJson(docJson);

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
  },
  // Light/dark toggle in the toolbar. Toggling adds/removes `.dark` on <html>,
  // which flips the theme CSS variables defined in styles.css.
  initialGlobals: {
    theme: 'light',
  },
  globalTypes: {
    theme: {
      description: 'Color theme',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (storyFn, context) => {
      const theme = context.globals['theme'] ?? 'light';
      document.documentElement.classList.toggle('dark', theme === 'dark');
      return storyFn();
    },
  ],
};

export default preview;
