import {
  escapeHtml,
  getFormattedCoordinates,
  getHostname,
  getScreenName,
  getScreenlyVersion,
  getTags,
  setupBranding,
  setupErrorHandling,
  signalReady,
} from '@screenly/edge-apps'

function setText(id: string, value: string | undefined): void {
  const el = document.getElementById(id)
  if (el) el.textContent = value || 'N/A'
}

export default async function init(): Promise<void> {
  setupErrorHandling()

  await setupBranding()

  setText('hostname', getHostname())
  setText('screen-name', getScreenName())
  setText('hardware', screenly.metadata.hardware)
  setText('version', getScreenlyVersion())
  setText('coordinates', getFormattedCoordinates())

  const tags = getTags()
  const labelsContainer = document.getElementById('labels')
  if (labelsContainer) {
    if (tags && tags.length > 0) {
      labelsContainer.innerHTML = tags
        .map(
          (tag) =>
            `<span class="label-chip inline-block bg-white/15 text-white border border-white/40 rounded-[calc(0.35*var(--su))] px-[calc(0.45*var(--su))] py-[calc(0.15*var(--su))] text-[calc(0.6*var(--su))] font-bold tracking-[0.06em] uppercase whitespace-nowrap leading-[1.4] portrait:rounded-[calc(1*var(--su))] portrait:px-[calc(1.5*var(--su))] portrait:py-[calc(0.75*var(--su))] portrait:text-[calc(2*var(--su))]">${escapeHtml(tag)}</span>`,
        )
        .join('')
    } else {
      labelsContainer.innerHTML =
        '<span class="no-labels text-[calc(0.75*var(--su))] text-white/80 italic">No labels assigned</span>'
    }
  }

  signalReady()
}
