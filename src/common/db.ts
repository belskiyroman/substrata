import { DateTime } from 'luxon'

export default {
  users: [
    {
      name: 'Roman',
      username: 'belskiyroman',
      email: 'belskiyroman@gmail.com',
      bitcoinAmount: 1.5,
      usdBalance: 100,
      id: '8b2c678a-8cb9-4601-a519-190df4c6419d',
      createdAt: '2021-03-17T20:05:56.428Z',
      updatedAt: '2021-03-17T20:05:56.428Z',
    },
  ],
  exchangeRates: [
    {
      id: 'af3e3af1-6fcc-42a6-a012-b58c39b1aa7f',
      name: 'bitcoin',
      price: 100.0,
      createdAt: DateTime.utc().toISO().toString(),
      updatedAt: DateTime.utc().toISO().toString(),
    },
  ],
}
