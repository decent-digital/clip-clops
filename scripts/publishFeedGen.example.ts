import dotenv from 'dotenv'
import { AtpAgent, BlobRef } from '@atproto/api'
import fs from 'fs/promises'
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

  // A display name for your feed
  // Ex: What's Hot
  const displayName = ''

  // (Optional) A description of your feed
  // Ex: Top trending content from the whole network
  const description = ''

  // (Optional) The path to an image to be used as your feed's avatar
  // Ex: ~/path/to/avatar.jpeg
  const avatar: string = ''

  // -------------------------------------
  // NO NEED TO TOUCH ANYTHING BELOW HERE
  // -------------------------------------

  if (!FEEDGEN_SERVICE_DID && !FEEDGEN_HOSTNAME) {
    throw new Error('Please provide a hostname in the .env file')
  }
  if (!handle || !password) {
    throw new Error('Please provide a handle and app password')
  }

  const feedGenDid = FEEDGEN_SERVICE_DID ?? `did:web:${FEEDGEN_HOSTNAME}`

  // only update this if in a test environment
  const agent = new AtpAgent({ service: 'https://bsky.social' })
  await agent.login({ identifier: handle, password })

  let avatarRef: BlobRef | undefined
  if (avatar) {
    let encoding: string
    if (avatar.endsWith('png')) {
      encoding = 'image/png'
    } else if (avatar.endsWith('jpg') || avatar.endsWith('jpeg')) {
      encoding = 'image/jpeg'
    } else {
      throw new Error('expected png or jpeg')
    }
    const img = await fs.readFile(avatar)
    const blobRes = await agent.api.com.atproto.repo.uploadBlob(img, {
      encoding,
    })
    avatarRef = blobRes.data.blob
  }

  await agent.com.atproto.repo.putRecord({
    repo: agent.session?.did ?? '',
    collection: ids.AppBskyFeedGenerator,
    rkey: recordName,
    record: {
      did: feedGenDid,
      displayName: displayName,
      description: description,
      avatar: avatarRef,
      createdAt: new Date().toISOString(),
    },
  })

  console.log('All done 🎉')
}

run()
