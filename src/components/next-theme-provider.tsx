import { ThemeProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes/dist/types';

const NextThemeProvider = ({children, ...props}: ThemeProviderProps) => {
    return (
        <ThemeProvider attribute='class' defaultTheme='dark' enableSystem>
            {children}
        </ThemeProvider>
    )
}

export default NextThemeProvider;