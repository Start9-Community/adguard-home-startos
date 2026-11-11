import { VersionGraph } from '@start9labs/start-sdk'
import { current } from './current'
import { v_0_107_79_1 } from './v0.107.79_1'

export const versionGraph = VersionGraph.of({
  current,
  other: [v_0_107_79_1],
})
