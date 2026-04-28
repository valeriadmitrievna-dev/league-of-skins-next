import https from 'node:https'

const url = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/skinlines.json'

const req = https.get(url, {
  headers: { 'User-Agent': 'Mozilla/5.0' },
  agent: new https.Agent({ keepAlive: false }),
}, (res) => {
  console.log('status:', res.statusCode)
  const chunks = []
  res.on('data', chunk => { chunks.push(chunk); process.stdout.write('.') })
  res.on('end', () => console.log('\ndone, size:', Buffer.concat(chunks).length))
  res.on('error', e => console.error('res error:', e.message))
})

req.on('error', e => console.error('req error:', e.message))
req.setTimeout(60000, () => { console.log('timeout'); req.destroy() })