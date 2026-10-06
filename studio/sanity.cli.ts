import { defineCliConfig } from 'sanity/cli';
import { projectId, dataset } from './env';

export default defineCliConfig({
  api: { projectId, dataset },
  // O Studio fica em https://<studioHost>.sanity.studio
  studioHost: 'tfcell',
  deployment: { autoUpdates: true },
});
