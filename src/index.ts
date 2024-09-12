import dotenv from 'dotenv'
import FeedGenerator from './server'

const {
  FEEDGEN_PORT,
  FEEDGEN_LISTENHOST,
  FEEDGEN_SQLITE_LOCATION,
  FEEDGEN_SUBSCRIPTION_ENDPOINT,
  FEEDGEN_HOSTNAME,
  FEEDGEN_PUBLISHER_DID,
  FEEDGEN_SERVICE_DID,
  FEEDGEN_SUBSCRIPTION_RECONNECT_DELAY,
} = process.env

const run = async () => {
  dotenv.config()
  const hostname = maybeStr(FEEDGEN_HOSTNAME) ?? 'example.com'
  const serviceDid = maybeStr(FEEDGEN_SERVICE_DID) ?? `did:web:${hostname}`
  const server = FeedGenerator.create({
    port: maybeInt(FEEDGEN_PORT) ?? 8080,
    listenhost: maybeStr(FEEDGEN_LISTENHOST) ?? '0.0.0.0',
    sqliteLocation: maybeStr(FEEDGEN_SQLITE_LOCATION) ?? ':memory:',
    subscriptionEndpoint:
      maybeStr(FEEDGEN_SUBSCRIPTION_ENDPOINT) ?? 'wss://bsky.network',
    publisherDid: maybeStr(FEEDGEN_PUBLISHER_DID) ?? 'did:example:alice',
    subscriptionReconnectDelay:
      maybeInt(FEEDGEN_SUBSCRIPTION_RECONNECT_DELAY) ?? 3000,
    hostname,
    serviceDid,
  })
  server.app.get('/', (req, res) => res.send('clip clops server welcomes you'))
  server.app.get('/h', (req, res) => res.send('ok'))
  await server.start()
  console.log(
    `🍿 clips clopping at http://${server.cfg.listenhost}:${server.cfg.port}`,
    {
      FEEDGEN_PORT,
      FEEDGEN_LISTENHOST,
      FEEDGEN_SQLITE_LOCATION,
      FEEDGEN_SUBSCRIPTION_ENDPOINT,
      FEEDGEN_HOSTNAME,
      FEEDGEN_PUBLISHER_DID,
      FEEDGEN_SUBSCRIPTION_RECONNECT_DELAY,
    },
  )
}

const maybeStr = (val?: string) => {
  if (!val) return undefined
  return val
}

const maybeInt = (val?: string) => {
  if (!val) return undefined
  const int = parseInt(val, 10)
  if (isNaN(int)) return undefined
  return int
}

run()
