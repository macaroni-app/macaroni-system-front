import { extendTheme, type ThemeConfig } from "@chakra-ui/react"
import { mode } from "@chakra-ui/theme-tools"

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
}

const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: "#f6f0ff",
      100: "#e9dbff",
      200: "#d2b8ff",
      300: "#b88eff",
      400: "#9c63ff",
      500: "#8146e6",
      600: "#6736b8",
      700: "#4f288d",
      800: "#381b63",
      900: "#23103f",
    },
  },
  semanticTokens: {
    colors: {
      appBg: {
        default: "gray.50",
        _dark: "#11131A",
      },
      appSurface: {
        default: "white",
        _dark: "#171923",
      },
      appSurfaceAlt: {
        default: "gray.50",
        _dark: "#1D2130",
      },
      appBorder: {
        default: "gray.200",
        _dark: "#2A3142",
      },
      appText: {
        default: "gray.800",
        _dark: "#F7FAFC",
      },
      appMutedText: {
        default: "gray.600",
        _dark: "#A0AEC0",
      },
      appHeaderBg: {
        default: "white",
        _dark: "#151824",
      },
      appInputBg: {
        default: "white",
        _dark: "#1A202C",
      },
      appHover: {
        default: "gray.100",
        _dark: "#222838",
      },
    },
  },
  components: {
    Card: {
      baseStyle: (props: { colorMode: "light" | "dark" }) => ({
        container: {
          background: mode("white", "appSurface")(props),
          borderColor: mode("gray.200", "appBorder")(props),
          boxShadow: mode("sm", "0 14px 38px rgba(0, 0, 0, 0.28)")(props),
        },
      }),
    },
    Input: {
      variants: {
        outline: (props: { colorMode: "light" | "dark" }) => ({
          field: {
            bg: mode("white", "appInputBg")(props),
            borderColor: mode("gray.200", "appBorder")(props),
            color: mode("gray.800", "appText")(props),
            _placeholder: {
              color: mode("gray.400", "gray.500")(props),
            },
            _hover: {
              borderColor: mode("gray.300", "gray.500")(props),
            },
            _focusVisible: {
              borderColor: mode("brand.500", "brand.300")(props),
              boxShadow: mode(
                "0 0 0 1px var(--chakra-colors-brand-500)",
                "0 0 0 1px var(--chakra-colors-brand-300)"
              )(props),
            },
          },
        }),
      },
      defaultProps: {
        variant: "outline",
      },
    },
    Select: {
      variants: {
        outline: (props: { colorMode: "light" | "dark" }) => ({
          field: {
            bg: mode("white", "appInputBg")(props),
            borderColor: mode("gray.200", "appBorder")(props),
            color: mode("gray.800", "appText")(props),
            _hover: {
              borderColor: mode("gray.300", "gray.500")(props),
            },
            _focusVisible: {
              borderColor: mode("brand.500", "brand.300")(props),
              boxShadow: mode(
                "0 0 0 1px var(--chakra-colors-brand-500)",
                "0 0 0 1px var(--chakra-colors-brand-300)"
              )(props),
            },
          },
        }),
      },
      defaultProps: {
        variant: "outline",
      },
    },
    Textarea: {
      variants: {
        outline: (props: { colorMode: "light" | "dark" }) => ({
          bg: mode("white", "appInputBg")(props),
          borderColor: mode("gray.200", "appBorder")(props),
          color: mode("gray.800", "appText")(props),
          _placeholder: {
            color: mode("gray.400", "gray.500")(props),
          },
          _hover: {
            borderColor: mode("gray.300", "gray.500")(props),
          },
          _focusVisible: {
            borderColor: mode("brand.500", "brand.300")(props),
            boxShadow: mode(
              "0 0 0 1px var(--chakra-colors-brand-500)",
              "0 0 0 1px var(--chakra-colors-brand-300)"
            )(props),
          },
        }),
      },
      defaultProps: {
        variant: "outline",
      },
    },
    FormLabel: {
      baseStyle: (props: { colorMode: "light" | "dark" }) => ({
        color: mode("gray.700", "gray.200")(props),
        fontWeight: "semibold",
      }),
    },
    Table: {
      variants: {
        simple: (props: { colorMode: "light" | "dark" }) => ({
          th: {
            borderColor: mode("gray.200", "appBorder")(props),
            color: mode("gray.600", "gray.400")(props),
          },
          td: {
            borderColor: mode("gray.100", "appBorder")(props),
            color: mode("gray.700", "gray.100")(props),
          },
        }),
      },
    },
    Modal: {
      baseStyle: (props: { colorMode: "light" | "dark" }) => ({
        dialog: {
          bg: mode("white", "appSurface")(props),
          borderWidth: "1px",
          borderColor: mode("gray.200", "appBorder")(props),
        },
        header: {
          color: mode("gray.800", "gray.100")(props),
        },
        body: {
          color: mode("gray.700", "gray.200")(props),
        },
      }),
    },
    Menu: {
      baseStyle: (props: { colorMode: "light" | "dark" }) => ({
        list: {
          bg: mode("white", "appSurface")(props),
          borderColor: mode("gray.200", "appBorder")(props),
        },
        item: {
          bg: "transparent",
          _hover: {
            bg: mode("gray.100", "appHover")(props),
          },
          _focus: {
            bg: mode("gray.100", "appHover")(props),
          },
        },
      }),
    },
  },
  styles: {
    global: {
      "html, body, #root": {
        minHeight: "100%",
        bg: "appBg",
      },
      body: {
        bg: "appBg",
        color: "appText",
        transitionProperty: "background-color, color, border-color",
        transitionDuration: "0.2s",
      },
      "*::placeholder": {
        color: "appMutedText",
      },
      "::selection": {
        background: "brand.500",
        color: "white",
      },
    },
  },
})

export default theme
