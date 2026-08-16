import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'vlmwys9m',
    dataset: 'production',
  },
  deployment: {
    /** Fixed so a deploy cannot be pointed at a different studio by mistake. */
    appId: 'xgi4fvskvtsy9cyul26yj8wk',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})
