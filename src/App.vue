<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-message-provider>
      <router-view />
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { NConfigProvider, NMessageProvider, darkTheme } from 'naive-ui'
import type { GlobalThemeOverrides } from 'naive-ui'

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#6C63FF',
    primaryColorHover: '#7C73FF',
    primaryColorPressed: '#5C53EF',
    primaryColorSuppl: '#6C63FF',
    successColor: '#4ECDC4',
    warningColor: '#FFD93D',
    errorColor: '#FF6B9D',
    infoColor: '#6C63FF',
    textColorBase: '#FFFFFF',
    textColor1: '#FFFFFF',
    textColor2: 'rgba(255, 255, 255, 0.9)',
    textColor3: 'rgba(255, 255, 255, 0.7)',
    borderRadius: '12px',
    borderRadiusSmall: '8px',
    cardColor: 'rgba(255, 255, 255, 0.08)',
    modalColor: 'rgba(45, 53, 97, 0.95)',
    bodyColor: '#1A1F3A',
    popoverColor: 'rgba(45, 53, 97, 0.98)',
    hoverColor: 'rgba(255, 255, 255, 0.12)',
    pressedColor: 'rgba(255, 255, 255, 0.08)',
    inputColor: 'rgba(255, 255, 255, 0.05)',
    inputColorDisabled: 'rgba(255, 255, 255, 0.02)',
    placeholderColor: 'rgba(255, 255, 255, 0.5)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    dividerColor: 'rgba(255, 255, 255, 0.1)',
  },
  Card: {
    borderRadius: '16px',
    color: 'rgba(255, 255, 255, 0.08)',
    colorModal: 'rgba(255, 255, 255, 0.08)',
    colorTarget: 'rgba(255, 255, 255, 0.08)',
    colorEmbedded: 'rgba(255, 255, 255, 0.05)',
    titleTextColor: '#FFFFFF',
    textColor: 'rgba(255, 255, 255, 0.9)',
  },
  Button: {
    borderRadiusMedium: '12px',
    borderRadiusSmall: '8px',
    borderRadiusLarge: '12px',
    textColorPrimary: '#FFFFFF',
    textColorHoverPrimary: '#FFFFFF',
    textColorPressedPrimary: '#FFFFFF',
    textColorFocusPrimary: '#FFFFFF',
    colorPrimary: '#6C63FF',
    colorHoverPrimary: '#7C73FF',
    colorPressedPrimary: '#5C53EF',
    colorFocusPrimary: '#6C63FF',
  },
  Input: {
    borderRadius: '8px',
    color: 'rgba(255, 255, 255, 0.05)',
    colorFocus: 'rgba(255, 255, 255, 0.08)',
    textColor: '#FFFFFF',
    placeholderColor: 'rgba(255, 255, 255, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderHover: '1px solid rgba(108, 99, 255, 0.5)',
    borderFocus: '1px solid #6C63FF',
  },
  Select: {
    peers: {
      InternalSelection: {
        borderRadius: '8px',
        color: 'rgba(255, 255, 255, 0.05)',
        colorActive: 'rgba(255, 255, 255, 0.08)',
        textColor: '#FFFFFF',
        placeholderColor: 'rgba(255, 255, 255, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderHover: '1px solid rgba(108, 99, 255, 0.5)',
        borderActive: '1px solid #6C63FF',
        borderFocus: '1px solid #6C63FF',
      }
    }
  },
  Tag: {
    borderRadius: '8px',
    color: 'rgba(108, 99, 255, 0.2)',
    textColor: '#6C63FF',
    border: 'none',
  }
}
</script>

<style>
:root {
  /* Deep purple-blue gradient background */
  --bg-gradient-start: #2D3561;
  --bg-gradient-end: #1A1F3A;
  --bg-gradient: linear-gradient(135deg, #2D3561 0%, #1A1F3A 100%);
  
  /* Card backgrounds */
  --card-bg: rgba(255, 255, 255, 0.08);
  --card-bg-hover: rgba(255, 255, 255, 0.12);
  
  /* Text colors */
  --text-primary: #FFFFFF;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --text-tertiary: rgba(255, 255, 255, 0.5);
  
  /* Accent colors */
  --accent-primary: #6C63FF;
  --accent-success: #4ECDC4;
  --accent-warning: #FFD93D;
  --accent-danger: #FF6B9D;
  
  /* Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  
  /* Shadows */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.15);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.2);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  width: 100%;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  background: var(--bg-gradient);
  background-attachment: fixed;
  color: var(--text-primary);
}

#app {
  min-height: 100vh;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.fade-in {
  animation: fadeIn 0.3s ease;
}

/* Card hover effects */
.n-card {
  transition: all 0.3s ease;
}

.n-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Button transitions */
.n-button {
  transition: all 0.2s ease;
}

/* Input focus effects */
.n-input:focus-within {
  box-shadow: 0 0 0 2px rgba(108, 99, 255, 0.2);
}
</style>
