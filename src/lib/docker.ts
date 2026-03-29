import Dockerode from 'dockerode';
import type { App, GroupedApps } from './types';

const docker = new Dockerode(
  process.env.DOCKER_HOST
    ? { host: process.env.DOCKER_HOST }
    : process.platform === 'win32'
      ? { socketPath: '//./pipe/docker_engine' }
      : { socketPath: '/var/run/docker.sock' }
);

function parseStatus(state: string): App['status'] {
  if (state === 'running') return 'running';
  if (state === 'paused') return 'paused';
  return 'exited';
}

export async function getDashboardApps(): Promise<GroupedApps> {
  try {
    const containers = await docker.listContainers({ all: true });

    const apps: App[] = containers
      .filter(c => c.Labels?.['dash.enable'] === 'true')
      .map(c => ({
        name: c.Labels['dash.name'] ?? c.Names[0]?.replace(/^\//, '') ?? 'Unknown',
        url: c.Labels['dash.url'] ?? '#',
        icon: c.Labels['dash.icon'] ?? 'mdi:application',
        description: c.Labels['dash.description'] || undefined,
        category: c.Labels['dash.category'] ?? 'Uncategorized',
        status: parseStatus(c.State),
      }));

    return apps.reduce<GroupedApps>((acc, app) => {
      (acc[app.category] ??= []).push(app);
      return acc;
    }, {});
  } catch (err) {
    console.error('[springboard] Failed to connect to Docker socket:', err);
    return {};
  }
}
