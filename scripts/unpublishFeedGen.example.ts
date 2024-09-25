import dotenv from 'dotenv'
import { AtpAgent } from '@atproto/api'
import { ids } from '@atproto/bsky/dist/lexicon/lexicons'

dotenv.config()

const {
  FEEDGEN_HANDLE,
  FEEDGEN_APP_PASSWORD,
  FEEDGEN_SERVICE_DID,
  FEEDGEN_HOSTNAME,
} = process.env

const run = async () => {
  // YOUR bluesky handle
  // Ex: user.bsky.social
  const handle = FEEDGEN_HANDLE

  // YOUR bluesky password, or preferably an App Password (found in your client settings)
  // Ex: abcd-1234-efgh-5678
  const password = FEEDGEN_APP_PASSWORD

  // A short name for the record that will show in urls
  // Lowercase with no spaces.
  // Ex: whats-hot
  const recordName = ''

  // -------------------------------------
  // NO NEED TO TOUCH ANYTHING BELOW HERE
  // -------------------------------------

  if (!FEEDGEN_SERVICE_DID && !FEEDGEN_HOSTNAME) {
    throw new Error('Please provide a hostname in the .env file')
  }
  if (!handle || !password) {
    throw new Error('Please provide a handle and app password')
  }

  // only update this if in a test environment
  const agent = new AtpAgent({ service: 'https://bsky.social' })
  await agent.login({ identifier: handle, password })

  await agent.com.atproto.repo.deleteRecord({
    repo: agent.session?.did ?? '',
    collection: ids.AppBskyFeedGenerator,
    rkey: recordName,
  })

  console.log('All done 🎉')
}

run()
