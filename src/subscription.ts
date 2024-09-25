import { FirehoseSubscriptionBase, getOpsByType } from './util/subscription'
import { ComAtprotoSyncSubscribeRepos } from '@atproto/api'

export class FirehoseSubscription extends FirehoseSubscriptionBase {
  async handleEvent(evt: ComAtprotoSyncSubscribeRepos.Commit) {
    if (!ComAtprotoSyncSubscribeRepos.isCommit(evt)) return
    const ops = await getOpsByType(evt).catch(e => {
      console.error('repo subscription could not handle message', e);
      return undefined;
    });

    if (!ops) return;

    console.log(ops)

    const postsToDelete = ops.posts.deletes.map((del) => del.uri)
    const postsToCreate = ops.posts.creates
      .filter((create) => {
        const isPost = create.record.$type === 'app.bsky.feed.post'
        const isVid = create.record.embed?.$type === 'app.bsky.embed.video'
        return isPost && isVid
      })
      .map((create) => {
        return {
          uri: create.uri,
          cid: create.cid,
          indexedAt: new Date().toISOString(),
        }
      })

    if (postsToDelete.length > 0) {
      await this.db
        .deleteFrom('post')
        .where('uri', 'in', postsToDelete)
        .execute()
    }
    if (postsToCreate.length > 0) {
      await this.db
        .insertInto('post')
        .values(postsToCreate)
        .onConflict((oc) => oc.doNothing())
        .execute()
    }
  }
}
