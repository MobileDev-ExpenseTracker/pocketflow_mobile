/**
 * App Entry Point
 * 
 * This file sets up the entire application including:
 * 1. Redux store for state management
 * 2. Localization (i18n) for multi-language support
 * 3. Native Base UI provider
 * 4. React Navigation for screen routing
 */

import React from "react";
import * as Localization from "expo-localization";
import { i18n, Language } from "@/Localization";
import { NativeBaseProvider } from "native-base";
import { store, persistor } from "@/Store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ApplicationNavigator } from "./Navigation";

// Setup localization with device locale
i18n.locale = Localization.locale;
i18n.enableFallback = true;
i18n.defaultLocale = Language.ENGLISH;

/**
 * App Component - Root component of the application
 * 
 * Provider hierarchy (from outside to inside):
 * 1. NativeBaseProvider - UI component library
 * 2. Redux Provider - Global state management
 * 3. PersistGate - Redux persistence (hydration)
 * 4. ApplicationNavigator - Screen routing
 */
export default function App() {
  return (
    <NativeBaseProvider>
      {/* Redux Provider makes store available to all components */}
      <Provider store={store}>
        {/* PersistGate ensures persisted state is loaded before rendering */}
        <PersistGate loading={null} persistor={persistor}>
          {/* Main navigation and screen routing */}
          <ApplicationNavigator />
        </PersistGate>
      </Provider>
    </NativeBaseProvider>
  );
}
      </Provider>
    </NativeBaseProvider>
  );
}
