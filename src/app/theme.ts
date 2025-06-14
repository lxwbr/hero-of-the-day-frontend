import { createTheme } from '@mantine/core';

export const theme = createTheme({
    primaryColor: 'green',
    components: {
        Anchor: {
          defaultProps: {
            underline: 'never',
          },
          styles: {
             root: {
               fontSize: '14px',
               fontWeight: 400,
             },
          },
    },
    },
});