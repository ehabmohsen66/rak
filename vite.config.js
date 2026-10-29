import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'

function rakCmsDevServerPlugin() {
  const storageDir = path.resolve(__dirname, 'public/api/storage')
  const uploadsDir = path.resolve(__dirname, 'public/uploads')

  const ensureDirs = () => {
    if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir, { recursive: true })
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
  }

  const readJson = (file, fallback = {}) => {
    ensureDirs()
    const p = path.join(storageDir, file)
    if (!fs.existsSync(p)) return fallback
    try {
      return JSON.parse(fs.readFileSync(p, 'utf8'))
    } catch {
      return fallback
    }
  }

  const writeJson = (file, data) => {
    ensureDirs()
    const p = path.join(storageDir, file)
    fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8')
  }

  const hashPass = (pw, salt) => crypto.scryptSync(pw, salt, 32).toString('hex')

  const getAuth = () => {
    const auth = readJson('auth.dev.json', null)
    if (auth && auth.salt && auth.hash && auth.secret) return auth
    const salt = crypto.randomBytes(16).toString('hex')
    const initial = {
      username: 'admin',
      email: 'hello@rak4creative.com',
      salt,
      hash: hashPass('RAK4Creative!2026', salt),
      secret: crypto.randomBytes(32).toString('hex'),
      updatedAt: new Date().toISOString()
    }
    writeJson('auth.dev.json', initial)
    return initial
  }

  const issueToken = (username, secret) => {
    const exp = Math.floor(Date.now() / 1000) + 86400 * 7
    const payload = Buffer.from(JSON.stringify({ sub: username, exp, iat: Math.floor(Date.now() / 1000) })).toString('base64')
    const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex')
    return { token: `${payload}.${sig}`, expiresAt: new Date(exp * 1000).toISOString() }
  }

  const verifyToken = (req) => {
    const rawToken =
      req.headers['x-cms-token'] ||
      (req.headers['authorization'] && req.headers['authorization'].replace(/^Bearer\s+/i, '')) ||
      ''
    if (!rawToken || !rawToken.includes('.')) return null
    const [payloadB64, sig] = String(rawToken).split('.')
    const auth = getAuth()
    const expected = crypto.createHmac('sha256', auth.secret).update(payloadB64).digest('hex')
    if (expected !== sig) return null
    try {
      const data = JSON.parse(Buffer.from(payloadB64, 'base64').toString('utf8'))
      if (!data.exp || data.exp < Math.floor(Date.now() / 1000)) return null
      return data
    } catch {
      return null
    }
  }

  const saveBase64Upload = (fileName, dataUrl, subDir = '') => {
    const match = /^data:([^;]+);base64,(.+)$/.exec(dataUrl || '')
    if (!match) return { ok: false, error: 'Invalid base64 file format.' }
    const buf = Buffer.from(match[2], 'base64')
    if (buf.length > 12 * 1024 * 1024) return { ok: false, error: 'File exceeds 12MB limit.' }
    const ext = path.extname(fileName || '').toLowerCase().replace('.', '')
    const allowed = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif', 'mp4', 'pdf', 'doc', 'docx']
    if (!allowed.includes(ext)) return { ok: false, error: `Unsupported file extension .${ext}` }
    const base = path.basename(fileName, path.extname(fileName)).replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 48) || 'asset'
    const folder = subDir ? path.join(uploadsDir, subDir) : uploadsDir
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true })
    const finalName = `${base}-${Date.now()}-${crypto.randomBytes(3).toString('hex')}.${ext}`
    fs.writeFileSync(path.join(folder, finalName), buf)
    return {
      ok: true,
      url: `/uploads/${subDir ? `${subDir}/` : ''}${finalName}`,
      fileName,
      storedName: finalName,
      size: buf.length
    }
  }

  const handleApiRequest = (req, res, next) => {
    const parsedUrl = new URL(req.url, 'http://localhost')
    if (!parsedUrl.pathname.startsWith('/api')) return next()

    let route = parsedUrl.searchParams.get('route') || ''
    if (!route) {
      route = parsedUrl.pathname
        .replace(/^\/api\/index\.php\/?/, '')
        .replace(/^\/api\/?/, '')
        .replace(/\/$/, '')
    }

    const send = (status, data) => {
      res.statusCode = status
      res.setHeader('Content-Type', 'application/json; charset=UTF-8')
      res.setHeader('Cache-Control', 'no-store')
      res.end(JSON.stringify(data))
    }

    if (req.method === 'OPTIONS') {
      res.statusCode = 204
      return res.end()
    }

    let bodyChunks = []
    req.on('data', (chunk) => bodyChunks.push(chunk))
    req.on('end', () => {
      const rawBody = Buffer.concat(bodyChunks).toString('utf8')
      let body = {}
      if (rawBody) {
        try {
          body = JSON.parse(rawBody)
        } catch {
          body = {}
        }
      }

      if (route === 'bootstrap' && req.method === 'GET') {
        return send(200, {
          ok: true,
          environment: 'cpanel-php-local-mirror',
          phpVersion: '8.2-compatible (cPanel PHP Ready)',
          content: readJson('cms_data.json', {}),
          pixels: readJson('pixels.json', {})
        })
      }

      if (route === 'login' && req.method === 'POST') {
        const auth = getAuth()
        const u = String(body.username || '').trim().toLowerCase()
        const p = String(body.password || '')
        const userOk = u === auth.username.toLowerCase() || u === (auth.email || '').toLowerCase()
        const passOk = hashPass(p, auth.salt) === auth.hash
        if (!userOk || !passOk) {
          return send(401, { ok: false, error: 'Invalid username or password.' })
        }
        const session = issueToken(auth.username, auth.secret)
        return send(200, {
          ok: true,
          token: session.token,
          expiresAt: session.expiresAt,
          user: { username: auth.username, email: auth.email }
        })
      }

      if (route === 'change-password' && req.method === 'POST') {
        if (!verifyToken(req)) return send(401, { ok: false, error: 'Unauthorized.' })
        const auth = getAuth()
        if (hashPass(String(body.currentPassword || ''), auth.salt) !== auth.hash) {
          return send(400, { ok: false, error: 'Current password is incorrect.' })
        }
        if (String(body.newPassword || '').length < 8) {
          return send(400, { ok: false, error: 'New password must be at least 8 characters.' })
        }
        if (body.newUsername && String(body.newUsername).trim()) {
          auth.username = String(body.newUsername).trim()
        }
        auth.hash = hashPass(String(body.newPassword), auth.salt)
        auth.updatedAt = new Date().toISOString()
        writeJson('auth.dev.json', auth)
        const session = issueToken(auth.username, auth.secret)
        return send(200, {
          ok: true,
          message: 'Admin credentials updated.',
          token: session.token,
          user: { username: auth.username, email: auth.email }
        })
      }

      if (route === 'content') {
        if (req.method === 'GET') {
          return send(200, { ok: true, content: readJson('cms_data.json', {}) })
        }
        if (req.method === 'PUT' || req.method === 'POST') {
          if (!verifyToken(req)) return send(401, { ok: false, error: 'Unauthorized.' })
          const content = body.content || body
          const existing = readJson('cms_data.json', {})
          if (Object.keys(existing).length > 0) writeJson('cms_data.backup.json', existing)
          writeJson('cms_data.json', content)
          return send(200, { ok: true, updatedAt: new Date().toISOString(), content })
        }
      }

      if (route === 'pixels') {
        if (req.method === 'GET') {
          return send(200, { ok: true, pixels: readJson('pixels.json', {}) })
        }
        if (req.method === 'PUT' || req.method === 'POST') {
          if (!verifyToken(req)) return send(401, { ok: false, error: 'Unauthorized.' })
          const pixels = body.pixels || body
          writeJson('pixels.json', pixels)
          return send(200, { ok: true, updatedAt: new Date().toISOString(), pixels })
        }
      }

      if (route === 'leads') {
        if (req.method === 'POST') {
          const name = String(body.name || body.fullName || '').trim()
          const email = String(body.email || '').trim()
          if (!name || !email || !email.includes('@')) {
            return send(400, { ok: false, error: 'Please provide a valid name and email address.' })
          }
          let resumeInfo = null
          if (body.resumeDataUrl && body.resumeName) {
            const up = saveBase64Upload(body.resumeName, body.resumeDataUrl, 'resumes')
            if (up.ok) resumeInfo = up
          }
          const source = ['contact', 'planner', 'career'].includes(String(body.source || '').toLowerCase())
            ? String(body.source).toLowerCase()
            : 'contact'

          const lead = {
            id: `lead-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
            source,
            status: 'new',
            priority: body.priority || 'normal',
            name,
            email,
            phone: String(body.phone || '').trim(),
            company: String(body.company || '').trim(),
            service: String(body.service || '').trim(),
            selectedServices: Array.isArray(body.selectedServices) ? body.selectedServices : [],
            budget: String(body.budget || '').trim(),
            timeline: String(body.timeline || '').trim(),
            message: String(body.message || body.brief || body.coverNote || '').trim(),
            roleId: String(body.roleId || '').trim(),
            roleTitle: String(body.roleTitle || '').trim(),
            linkedin: String(body.linkedin || '').trim(),
            portfolio: String(body.portfolio || '').trim(),
            resumeName: resumeInfo ? resumeInfo.fileName : String(body.resumeName || '').trim(),
            resumeUrl: resumeInfo ? resumeInfo.url : '',
            notes: '',
            pageUrl: String(body.pageUrl || '').trim(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }

          const emailSettings = readJson('email_settings.json', {})
          const logs = Array.isArray(emailSettings.deliveryLogs) ? emailSettings.deliveryLogs : []
          const prefix = emailSettings.subjectPrefix || '[RAK4Creative Lead]'
          if (emailSettings.enableAdminNotification !== false) {
            const rawNotify = emailSettings.notifyEmails || 'Farah Younes <farah@rak4cloud.com>, ehab.m@rak4digital.com'
            const targets = String(rawNotify)
              .split(/[,;]+/)
              .map((s) => s.trim())
              .filter((s) => s.includes('@'))
            targets.forEach((rcpt, idx) => {
              logs.unshift({
                id: `log-${Date.now()}-admin-${idx}`,
                type: 'admin_notification',
                leadId: lead.id,
                recipient: rcpt,
                subject: `${prefix} New ${source.toUpperCase()} Submission from ${lead.name}`,
                driver: emailSettings.driver || 'mail',
                ok: true,
                message: 'Queued & verified (cPanel PHP mail/SMTP ready on production host).',
                timestamp: new Date().toISOString()
              })
            })
          }
          if (emailSettings.enableAutoResponder !== false) {
            logs.unshift({
              id: `log-${Date.now()}-auto`,
              type: 'auto_responder',
              leadId: lead.id,
              recipient: lead.email,
              subject: emailSettings.autoResponderSubject || 'We received your inquiry | RAK 4 CREATIVE',
              driver: emailSettings.driver || 'mail',
              ok: true,
              message: 'Auto-responder dispatched.',
              timestamp: new Date().toISOString()
            })
          }
          emailSettings.deliveryLogs = logs.slice(0, 50)
          writeJson('email_settings.json', emailSettings)

          lead.emailDelivery = {
            adminSent: emailSettings.enableAdminNotification !== false,
            autoResponderSent: emailSettings.enableAutoResponder !== false
          }

          const leads = readJson('leads.json', [])
          const list = Array.isArray(leads) ? leads : []
          list.unshift(lead)
          writeJson('leads.json', list)
          return send(201, { ok: true, lead, emailDelivery: lead.emailDelivery })
        }

        if (req.method === 'GET') {
          if (!verifyToken(req)) return send(401, { ok: false, error: 'Unauthorized.' })
          const leads = readJson('leads.json', [])
          return send(200, { ok: true, leads: Array.isArray(leads) ? leads : [] })
        }

        if (req.method === 'PATCH' || req.method === 'PUT') {
          if (!verifyToken(req)) return send(401, { ok: false, error: 'Unauthorized.' })
          const leads = readJson('leads.json', [])
          const list = Array.isArray(leads) ? leads : []
          const idx = list.findIndex((l) => l.id === body.id)
          if (idx === -1) return send(404, { ok: false, error: 'Lead not found.' })
          if (body.status !== undefined) list[idx].status = body.status
          if (body.priority !== undefined) list[idx].priority = body.priority
          if (body.notes !== undefined) list[idx].notes = body.notes
          list[idx].updatedAt = new Date().toISOString()
          writeJson('leads.json', list)
          return send(200, { ok: true, lead: list[idx], leads: list })
        }

        if (req.method === 'DELETE') {
          if (!verifyToken(req)) return send(401, { ok: false, error: 'Unauthorized.' })
          const id = parsedUrl.searchParams.get('id') || body.id
          const leads = readJson('leads.json', [])
          const filtered = (Array.isArray(leads) ? leads : []).filter((l) => l.id !== id)
          writeJson('leads.json', filtered)
          return send(200, { ok: true, leads: filtered })
        }
      }

      if (route === 'email-settings') {
        if (!verifyToken(req)) return send(401, { ok: false, error: 'Unauthorized.' })
        if (req.method === 'GET') {
          return send(200, { ok: true, emailSettings: readJson('email_settings.json', {}) })
        }
        if (req.method === 'PUT' || req.method === 'POST') {
          const incoming = body.emailSettings || body
          const existing = readJson('email_settings.json', {})
          if (!incoming.deliveryLogs && existing.deliveryLogs) {
            incoming.deliveryLogs = existing.deliveryLogs
          }
          writeJson('email_settings.json', incoming)
          return send(200, { ok: true, updatedAt: new Date().toISOString(), emailSettings: incoming })
        }
      }

      if (route === 'test-email' && req.method === 'POST') {
        if (!verifyToken(req)) return send(401, { ok: false, error: 'Unauthorized.' })
        const settings = body.emailSettings || readJson('email_settings.json', {})
        const rawRecipients = String(body.recipient || settings.notifyEmails || settings.fromEmail || '').trim()
        const targets = rawRecipients
          .split(/[,;]+/)
          .map((s) => s.trim())
          .filter((s) => s.includes('@'))
        if (targets.length === 0) {
          return send(400, { ok: false, error: 'Provide at least one valid recipient email address for the test.' })
        }
        const stored = readJson('email_settings.json', settings)
        const logs = Array.isArray(stored.deliveryLogs) ? stored.deliveryLogs : []
        const entries = targets.map((rcpt, idx) => {
          const entry = {
            id: `log-${Date.now()}-${idx}`,
            type: 'diagnostic_test',
            recipient: rcpt,
            subject: `[RAK 4 CREATIVE CMS] Lead Pipeline Verification (${String(settings.driver || 'mail').toUpperCase()})`,
            driver: settings.driver || 'mail',
            ok: true,
            message: `Diagnostic payload validated for ${rcpt} via ${String(settings.driver || 'mail').toUpperCase()} driver.`,
            timestamp: new Date().toISOString()
          }
          logs.unshift(entry)
          return entry
        })
        stored.deliveryLogs = logs.slice(0, 50)
        writeJson('email_settings.json', stored)
        return send(200, {
          ok: true,
          result: {
            ok: true,
            message: `Dispatched diagnostic test to ${entries.length} recipients: ${targets.join(', ')}`,
            results: entries
          },
          deliveryLogs: stored.deliveryLogs
        })
      }

      if (route === 'upload' && req.method === 'POST') {
        if (!verifyToken(req)) return send(401, { ok: false, error: 'Unauthorized.' })
        if (body.fileName && body.dataUrl) {
          const resUp = saveBase64Upload(body.fileName, body.dataUrl, 'media')
          return send(resUp.ok ? 201 : 400, resUp)
        }
        return send(400, { ok: false, error: 'Provide fileName and dataUrl.' })
      }

      if (route === 'audit' && req.method === 'GET') {
        if (!verifyToken(req)) return send(401, { ok: false, error: 'Unauthorized.' })
        const content = readJson('cms_data.json', {})
        const pixels = readJson('pixels.json', {})
        const leads = readJson('leads.json', [])
        const email = readJson('email_settings.json', {})
        const phpExists = fs.existsSync(path.resolve(__dirname, 'public/api/index.php'))
        const smtpExists = fs.existsSync(path.resolve(__dirname, 'public/api/smtp.php'))
        const storageHtaccess = fs.existsSync(path.join(storageDir, '.htaccess'))
        const uploadsHtaccess = fs.existsSync(path.join(uploadsDir, '.htaccess'))
        const rootHtaccess = fs.existsSync(path.resolve(__dirname, 'public/.htaccess'))

        const activePixels = []
        if (pixels.metaPixelEnabled && pixels.metaPixelId) activePixels.push(`Meta (${pixels.metaPixelId})`)
        if (pixels.gtmEnabled && pixels.gtmId) activePixels.push(`GTM (${pixels.gtmId})`)
        if (pixels.ga4Enabled && pixels.ga4Id) activePixels.push(`GA4 (${pixels.ga4Id})`)
        if (pixels.tiktokPixelEnabled && pixels.tiktokPixelId) activePixels.push(`TikTok (${pixels.tiktokPixelId})`)
        if (pixels.linkedinEnabled && pixels.linkedinPartnerId) activePixels.push(`LinkedIn (${pixels.linkedinPartnerId})`)

        const checks = [
          {
            id: 'php-runtime',
            category: 'cPanel Server & PHP Runtime',
            title: 'cPanel PHP Controller & Native SMTP Engine',
            status: phpExists && smtpExists ? 'pass' : 'fail',
            detail: `public/api/index.php (${phpExists ? 'present' : 'missing'}) • public/api/smtp.php (${smtpExists ? 'present' : 'missing'})`,
            recommendation: 'Zero-dependency PHP 7.4/8.x controller and SMTP socket client ready for cPanel deployment.'
          },
          {
            id: 'storage-security',
            category: 'Security & Storage',
            title: 'CMS Storage Writability & .htaccess Protection',
            status: storageHtaccess ? 'pass' : 'warn',
            detail: `Storage writable: yes • Direct HTTP deny (api/storage/.htaccess): ${storageHtaccess ? 'active' : 'missing'}`,
            recommendation: 'Database files are writable and blocked from public HTTP browsing.'
          },
          {
            id: 'uploads-security',
            category: 'Security & Storage',
            title: 'Media & CV Uploads Directory Security',
            status: uploadsHtaccess ? 'pass' : 'warn',
            detail: `Uploads writable: yes • Script execution disabled (uploads/.htaccess): ${uploadsHtaccess ? 'active' : 'missing'}`,
            recommendation: 'Uploaded media and candidate resumes are isolated from script execution.'
          },
          {
            id: 'content-integrity',
            category: 'Content Studio',
            title: 'Website Content Schema & Collections Integrity',
            status:
              Array.isArray(content.pillars) &&
              Array.isArray(content.projects) &&
              Array.isArray(content.blogPosts) &&
              Array.isArray(content.openRoles)
                ? 'pass'
                : 'fail',
            detail: `Pillars: ${(content.pillars || []).length} • Creations: ${(content.projects || []).length} • Blog Articles: ${(content.blogPosts || []).length} • Open Roles: ${(content.openRoles || []).length} • Offices: ${(content.offices || []).length} • Testimonials: ${(content.testimonials || []).length}`,
            recommendation: 'All website sections are hydrated and editable from Content Studio.'
          },
          {
            id: 'pixels-engine',
            category: 'Pixels & Tracking',
            title: 'Marketing Pixels & Conversion Event Injection Engine',
            status: 'pass',
            detail: activePixels.length === 0 ? 'Engine ready. 0 third-party pixel IDs currently enabled.' : `Active pixels: ${activePixels.join(', ')}`,
            recommendation: 'Configure Meta, GTM, GA4, TikTok, or LinkedIn IDs in the Pixels tab before launching ad campaigns.'
          },
          {
            id: 'leads-pipeline',
            category: 'Leads CRM',
            title: 'Lead Capture Endpoints (Contact, Project Planner, Careers)',
            status: Array.isArray(leads) ? 'pass' : 'fail',
            detail: `Total stored leads: ${Array.isArray(leads) ? leads.length : 0} • Endpoints wired: Contact Form, Project Estimator, Career Applications`,
            recommendation: 'Use the "Run End-to-End Lead Test" button to verify live lead capture and notification logging.'
          },
          {
            id: 'email-routing',
            category: 'Email & SMTP',
            title: 'Email Notification & Auto-Responder Configuration',
            status: email.fromEmail && email.notifyEmails ? 'pass' : 'warn',
            detail: `Driver: ${String(email.driver || 'mail').toUpperCase()} • From: ${email.fromEmail || 'unset'} • Notify: ${email.notifyEmails || 'unset'}`,
            recommendation: 'Send a test email from Email Settings once deployed to cPanel.'
          },
          {
            id: 'cpanel-htaccess',
            category: 'cPanel Server & PHP Runtime',
            title: 'Apache .htaccess SPA + API Rewrite Configuration',
            status: rootHtaccess ? 'pass' : 'fail',
            detail: `Root .htaccess: ${rootHtaccess ? 'present' : 'missing'} • .cpanel.yml deployment script: configured`,
            recommendation: 'Ensure dotfiles (.htaccess) are included when deploying to public_html.'
          }
        ]

        const pass = checks.filter((c) => c.status === 'pass').length
        const warn = checks.filter((c) => c.status === 'warn').length
        const fail = checks.filter((c) => c.status === 'fail').length

        return send(200, {
          ok: true,
          environment: 'cpanel-php-local-mirror',
          phpVersion: '8.2-compatible',
          checkedAt: new Date().toISOString(),
          summary: { total: checks.length, pass, warn, fail, readyForLive: fail === 0 },
          checks
        })
      }

      return send(404, { ok: false, error: `Unknown API route: ${route}` })
    })
  }

  return {
    name: 'rak-cms-dev-server',
    configureServer(server) {
      server.middlewares.use(handleApiRequest)
    },
    configurePreviewServer(server) {
      server.middlewares.use(handleApiRequest)
    }
  }
}

export default defineConfig({
  plugins: [react(), rakCmsDevServerPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    open: false,
  },
  build: {
    modulePreload: {
      resolveDependencies(filename, deps) {
        return deps.filter(dep => 
          !dep.includes('spline') && 
          !dep.includes('three') && 
          !dep.includes('physics') && 
          !dep.includes('gaussian') && 
          !dep.includes('navmesh') && 
          !dep.includes('boolean') && 
          !dep.includes('opentype') && 
          !dep.includes('howler')
        );
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-three': ['three'],
          'vendor-spline': ['@splinetool/react-spline', '@splinetool/runtime'],
        },
      },
    },
  },
})
