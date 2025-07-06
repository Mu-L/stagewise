import { useAgents } from '@/hooks/agent/use-agent-provider';
import { RefreshCwIcon } from 'lucide-react';

export const ConnectionSettings = () => {
  const {
    availableAgents,
    isRefreshing,
    refreshAgentList,
    connectAgent,
    connected,
  } = useAgents();

  const handleSessionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const target = e.target as HTMLSelectElement;
    const selectedAgentPort =
      target.value === '' ? undefined : Number(target.value);
    connectAgent(selectedAgentPort);
  };

  return (
    <div className="space-y-4 pb-4">
      <div>
        <label
          htmlFor="agent-select"
          className="mb-2 block font-medium text-sm text-zinc-700"
        >
          Agent
        </label>
        <div className="flex w-full items-center space-x-2">
          <select
            id="agent-select"
            value={connected?.port || ''}
            onChange={handleSessionChange}
            className="h-8 min-w-0 flex-1 rounded-lg border border-zinc-300 bg-zinc-500/10 px-3 text-sm backdrop-saturate-150 focus:border-zinc-500 focus:outline-none"
            disabled={isRefreshing}
          >
            <option value="" disabled>
              {availableAgents.length > 0
                ? 'Select an agent...'
                : 'No agents available'}
            </option>
            {availableAgents.map((agent) => (
              <option key={agent.port} value={agent.port}>
                {agent.name} - {agent.description} - Port {agent.port}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={refreshAgentList}
            disabled={isRefreshing}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-zinc-500/10 backdrop-saturate-150 transition-colors hover:bg-zinc-500/20 disabled:opacity-50"
            title="Refresh window list"
          >
            <RefreshCwIcon
              className={`size-4 ${isRefreshing ? 'animate-spin' : ''}`}
            />
          </button>
        </div>
        {!isRefreshing && availableAgents.length === 0 && (
          <p className="mt-1 text-sm text-zinc-500">
            No agents found. Make sure the stagewise extension is installed and
            running.
          </p>
        )}
      </div>

      {connected && (
        <div className="rounded-lg bg-blue-500/20 p-3">
          <p className="font-medium text-blue-800 text-sm">Active Agent</p>

          <p className="mt-2 font-semibold text-base text-blue-800">
            {connected.name}
          </p>
          <p className="text-blue-600 text-xs">{connected.description}</p>
          <p className="text-blue-500 text-xs">Port {connected.port}</p>
        </div>
      )}

      {!connected && availableAgents.length > 0 && (
        <div className="rounded-lg bg-amber-500/20 p-3">
          <p className="text-amber-800 text-sm">
            <strong>No agent selected:</strong> Please select an agent above to
            connect.
          </p>
        </div>
      )}
    </div>
  );
};
