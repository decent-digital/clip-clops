import dotenv from 'dotenv'
import FeedGenerator from './server'

dotenv.config()

const {
  FEEDGEN_PORT = 8080,
  FEEDGEN_LISTENHOST = '0.0.0.0',
  FEEDGEN_SQLITE_LOCATION = ':memory:',
  FEEDGEN_SUBSCRIPTION_ENDPOINT = 'wss://bsky.network',
  FEEDGEN_HOSTNAME = 'example.com',
  FEEDGEN_PUBLISHER_DID = 'did:example:alice',
  FEEDGEN_SUBSCRIPTION_RECONNECT_DELAY = 3000,
} = process.env

const { FEEDGEN_SERVICE_DID = `did:web:${FEEDGEN_HOSTNAME}` } = process.env

const run = async () => {
  const server = FeedGenerator.create({
    port: Number(FEEDGEN_PORT),
    listenhost: FEEDGEN_LISTENHOST,
    sqliteLocation: FEEDGEN_SQLITE_LOCATION,
    subscriptionEndpoint: FEEDGEN_SUBSCRIPTION_ENDPOINT,
    publisherDid: FEEDGEN_PUBLISHER_DID,
    subscriptionReconnectDelay: Number(FEEDGEN_SUBSCRIPTION_RECONNECT_DELAY),
    hostname: FEEDGEN_HOSTNAME,
    serviceDid: FEEDGEN_SERVICE_DID,
  })

  server.app.get('/', (req, res) => res.send('clip clops server welcomes you'))
  server.app.get('/health', (req, res) => res.send('ok'))
  server.app.get('/sup', async (req, res) => {
    const sup = await server.db
      .selectFrom('post')
      .select((eb) => eb.fn.count('uri').as('clips'))
      .execute()
    res.send(sup[0])
  })

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

run()
