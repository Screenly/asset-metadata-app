import {
  escapeHtml,
  getFormattedCoordinates,
  getHostname,
  getLocation,
  getScreenName,
  getScreenlyVersion,
  getTags,
  setupBranding,
  setupErrorHandling,
  signalReady,
} from '@screenly/edge-apps'
import { renderDisplay, startClock } from './live'

function setText(id: string, value: string | undefined): void {
  const el = document.getElementById(id)
  if (el) el.textContent = value || 'N/A'
}

function renderLocation(location: string | undefined): void {
  const row = document.getElementById('location-row')
  const el = document.getElementById('location')
  if (!row || !el) return
  const value = location?.trim()
  el.textContent = value || ''
  row.hidden = !value
}

function renderLogo(logoUrl: string | undefined): void {
  const logo = document.getElementById('brand-logo') as HTMLImageElement | null
  if (!logo || !logoUrl) return
  logo.src = logoUrl
  logo.hidden = false
}

function renderLabels(tags: string[] | undefined): void {
  const container = document.getElementById('labels')
  if (!container) return
  if (tags && tags.length > 0) {
    container.innerHTML = tags
      .map((tag) => `<span class="label-chip">${escapeHtml(tag)}</span>`)
      .join('')
  } else {
    container.innerHTML = '<span class="no-labels">No labels assigned</span>'
  }
}

async function render(): Promise<void> {
  const { logoUrl } = await setupBranding()
  renderLogo(logoUrl)

  setText('screen-name', getScreenName())
  setText('hostname', getHostname())
  setText('hardware', screenly.metadata.hardware)
  setText('version', getScreenlyVersion())
  setText('coordinates', getFormattedCoordinates())
  renderLocation(getLocation())
  renderLabels(getTags())
  renderDisplay()
  window.addEventListener('resize', renderDisplay)
  await startClock()
}

export default async function init(): Promise<void> {
  setupErrorHandling()

  try {
    await render()
  } finally {
    // Always tell the player we're ready, even if part of rendering failed,
    // so the screen never hangs waiting for the ready timeout.
    signalReady()
  }
}
