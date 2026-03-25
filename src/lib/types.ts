export interface App {
  name: string;
  url: string;
  icon: string;
  description?: string;
  category: string;
  status: 'running' | 'exited' | 'paused';
}

export type GroupedApps = Record<string, App[]>;
