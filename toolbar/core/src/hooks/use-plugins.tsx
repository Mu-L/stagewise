import { createContext, type ReactNode } from 'react';
import { useContext, useEffect, useMemo, useRef } from 'react';
import type { ToolbarContext, ToolbarPlugin } from '@/plugin';
import { useConfig } from './use-config';
import type { UserMessage } from '@stagewise/agent-interface/toolbar';
import { useAgentMessaging } from './agent/use-agent-messaging';

export interface PluginContextType {
  plugins: ToolbarPlugin[];
  toolbarContext: ToolbarContext;
}

const PluginContext = createContext<PluginContextType>({
  plugins: [],
  toolbarContext: {
    sendPrompt: () => {},
    mainAppWindow: window.parent,
  },
});

export function PluginProvider({ children }: { children?: ReactNode }) {
  const { config } = useConfig();

  const { sendMessage } = useAgentMessaging();

  const plugins = config?.plugins || [];

  const toolbarContext = useMemo(() => {
    return {
      sendPrompt: async (prompt: UserMessage) => {
        sendMessage(prompt);
      },
      mainAppWindow: window.parent,
    };
  }, [sendMessage]);

  // call plugins once on initial load
  const pluginsLoadedRef = useRef(false);
  useEffect(() => {
    if (pluginsLoadedRef.current) return;
    pluginsLoadedRef.current = true;
    console.log('plugins', plugins);
    plugins.forEach((plugin) => {
      plugin.onLoad?.(toolbarContext);
    });
  }, [plugins, toolbarContext]);

  const value = useMemo(() => {
    return {
      plugins,
      toolbarContext,
    };
  }, [plugins, toolbarContext]);

  return (
    <PluginContext.Provider value={value}>{children}</PluginContext.Provider>
  );
}

export function usePlugins() {
  return useContext(PluginContext);
}
