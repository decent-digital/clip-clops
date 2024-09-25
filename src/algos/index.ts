import { AppContext } from '../config'
import { AppBskyFeedGetFeedSkeleton } from '@atproto/api'
import * as clipClops from './clip-clops'


type AlgoHandler = (
  ctx: AppContext,
  params: AppBskyFeedGetFeedSkeleton.QueryParams,
) => Promise<AppBskyFeedGetFeedSkeleton.OutputSchema>

const algos: Record<string, AlgoHandler> = {
  [clipClops.shortname]: clipClops.handler,
}

export default algos
