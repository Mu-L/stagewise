import { RefreshCwIcon } from 'lucide-react';
import { ToolbarSection } from '../section';
import { ToolbarButton } from '../button';
import { cn } from '@/utils';
import { useAgents } from '@/hooks/agent/use-agent-provider';

export function DisconnectedStateButtons() {
  const { refreshAgentList, isRefreshing } = useAgents();

  return (
    <ToolbarSection>
      <ToolbarButton
        onClick={!isRefreshing ? () => refreshAgentList() : undefined}
        className={cn(
          !isRefreshing
            ? 'text-orange-700 hover:bg-orange-200'
            : 'text-blue-700',
        )}
      >
        <RefreshCwIcon
          className={cn('size-4', isRefreshing && 'animate-spin')}
        />
      </ToolbarButton>
    </ToolbarSection>
  );
}
