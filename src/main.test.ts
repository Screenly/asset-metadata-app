import { describe, test, expect, beforeEach, afterEach } from 'bun:test'
import { setupScreenlyMock, resetScreenlyMock } from '@screenly/edge-apps/test'

import init from './app'
import { formatClock, stopClock } from './live'

function setup(): void {
  document.body.innerHTML = `
    <div id="hostname"></div>
    <div id="screen-name"></div>
    <div id="hardware"></div>
    <div id="version"></div>
    <div id="coordinates"></div>
    <div id="location-row" hidden><span id="location"></span></div>
    <div id="labels"></div>
    <span id="local-time"></span>
    <span id="timezone"></span>
    <span id="display"></span>
  `

  setupScreenlyMock({
    hostname: 'srly-abc123',
    screen_name: 'Lobby Display',
    hardware: 'rpi4',
    screenly_version: '2.0.0',
    coordinates: [40.7128, -74.006],
    location: 'New York, NY',
    tags: ['lobby', 'floor-1'],
  })
}

describe('Asset Metadata', () => {
  beforeEach(setup)

  afterEach(() => {
    stopClock()
    resetScreenlyMock()
    document.body.innerHTML = ''
  })

  test('renders hostname', async () => {
    await init()
    expect(document.querySelector('#hostname')?.textContent).toBe('srly-abc123')
  })

  test('renders screen name', async () => {
    await init()
    expect(document.querySelector('#screen-name')?.textContent).toBe(
      'Lobby Display',
    )
  })

  test('renders hardware', async () => {
    await init()
    expect(document.querySelector('#hardware')?.textContent).toBe('rpi4')
  })

  test('renders version', async () => {
    await init()
    expect(document.querySelector('#version')?.textContent).toBe('2.0.0')
  })

  test('renders coordinates', async () => {
    await init()
    expect(document.querySelector('#coordinates')?.textContent).toBe(
      '40.7128° N, 74.0060° W',
    )
  })

  test('renders label chips', async () => {
    await init()
    const chips = document.querySelectorAll('#labels .label-chip')
    expect(chips).toHaveLength(2)
    expect(chips[0].textContent).toBe('lobby')
    expect(chips[1].textContent).toBe('floor-1')
  })

  test('renders no-labels message when tags are empty', async () => {
    setupScreenlyMock({ tags: [] })
    await init()
    expect(document.querySelector('#labels .no-labels')?.textContent).toBe(
      'No labels assigned',
    )
  })

  test('escapes HTML in label chips', async () => {
    setupScreenlyMock({ tags: ['<script>alert("xss")</script>'] })
    await init()
    const chip = document.querySelector('#labels .label-chip')
    expect(chip?.textContent).toBe('<script>alert("xss")</script>')
    expect(chip?.innerHTML).not.toContain('<script>')
  })
})

describe('Asset Metadata location', () => {
  beforeEach(setup)

  afterEach(() => {
    stopClock()
    resetScreenlyMock()
    document.body.innerHTML = ''
  })

  test('renders location', async () => {
    await init()
    expect(document.querySelector('#location')?.textContent).toBe(
      'New York, NY',
    )
    expect(
      (document.querySelector('#location-row') as HTMLElement).hidden,
    ).toBe(false)
  })

  test('hides location row when location is empty', async () => {
    setupScreenlyMock({ location: '' })
    await init()
    expect(
      (document.querySelector('#location-row') as HTMLElement).hidden,
    ).toBe(true)
  })
})

describe('Asset Metadata live info', () => {
  beforeEach(setup)

  afterEach(() => {
    stopClock()
    resetScreenlyMock()
    document.body.innerHTML = ''
  })

  test('renders time zone derived from coordinates', async () => {
    await init()
    expect(document.querySelector('#timezone')?.textContent).toBe(
      'America/New York',
    )
  })

  test('renders local time', async () => {
    await init()
    expect(document.querySelector('#local-time')?.textContent).toMatch(
      /\d{2}:\d{2}/,
    )
  })

  test('formats clock in the given time zone', () => {
    const date = new Date('2025-02-19T21:20:00Z')
    expect(formatClock(date, 'en-GB', 'America/New_York')).toBe('16:20')
  })

  test('renders display resolution and orientation', async () => {
    await init()
    expect(document.querySelector('#display')?.textContent).toMatch(
      /^\d+ × \d+ · (Landscape|Portrait)$/,
    )
  })
})
