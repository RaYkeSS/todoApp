import { ReactNode } from "react";
import {
  ChakraProvider as DefaultChakraProvider,
  createSystem,
  defaultConfig,
  defineConfig,
  Theme,
} from "@chakra-ui/react";
import { useThemeStore } from "../../entities/theme/store.ts";
import { Toaster } from "../../shared/ui/toaster.tsx";

const config = defineConfig({
  theme: {
    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: {
            value: { _light: "{colors.white}", _dark: "#1d1d1e" },
          },
          subtle: {
            value: { _light: "{colors.gray.50}", _dark: "#1a1a1a" },
          },
          muted: {
            value: { _light: "{colors.gray.100}", _dark: "#262626" },
          },
        },
        fg: {
          DEFAULT: {
            value: { _light: "{colors.black}", _dark: "#e5e5e5" },
          },
          muted: {
            value: { _light: "{colors.gray.600}", _dark: "#a3a3a3" },
          },
        },
        border: {
          DEFAULT: {
            value: { _light: "{colors.gray.200}", _dark: "#404040" },
          },
        },
      },
    },
  },
});

const system = createSystem(defaultConfig, config);

export function ChakraProvider({ children }: { children: ReactNode }) {
  const { theme } = useThemeStore();

  return (
    <DefaultChakraProvider value={system}>
      <Theme appearance={theme} colorPalette="teal">
        <Toaster />
        {children}
      </Theme>
    </DefaultChakraProvider>
  );
}
