import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import type { ReactNode } from 'react'
import { BackgroundVideoProvider, useBackgroundVideo } from './BackgroundVideoContext'
import { claimPlayback } from '../components/media/activeAudio'

const wrapper = ({ children }: { children: ReactNode }) => (
  <BackgroundVideoProvider>{children}</BackgroundVideoProvider>
)

describe('BackgroundVideoContext', () => {
  it('mute sets video.muted and muted state', () => {
    const { result } = renderHook(() => useBackgroundVideo(), { wrapper })
    const video = document.createElement('video')
    ;(result.current.videoRef as { current: HTMLVideoElement | null }).current = video
    act(() => result.current.unmute())
    expect(video.muted).toBe(false)
    expect(result.current.muted).toBe(false)
    act(() => result.current.mute())
    expect(video.muted).toBe(true)
    expect(result.current.muted).toBe(true)
  })

  it('toggleMute unmutes and plays', () => {
    const { result } = renderHook(() => useBackgroundVideo(), { wrapper })
    const video = document.createElement('video')
    video.muted = true
    const play = vi.spyOn(video, 'play').mockResolvedValue(undefined)
    ;(result.current.videoRef as { current: HTMLVideoElement | null }).current = video
    expect(result.current.muted).toBe(true)
    act(() => result.current.toggleMute())
    expect(video.muted).toBe(false)
    expect(play).toHaveBeenCalled()
    expect(result.current.muted).toBe(false)
    act(() => result.current.toggleMute())
    expect(video.muted).toBe(true)
  })

  it('unmuting pauses whatever is playing in a project', () => {
    const { result } = renderHook(() => useBackgroundVideo(), { wrapper })
    const video = document.createElement('video')
    video.muted = true
    ;(result.current.videoRef as { current: HTMLVideoElement | null }).current = video
    const track = { pause: vi.fn() }
    claimPlayback(track)
    act(() => result.current.unmute())
    expect(track.pause).toHaveBeenCalledTimes(1)
    // The claim is released: a later player starting doesn't pause it again.
    claimPlayback({ pause: vi.fn() })
    expect(track.pause).toHaveBeenCalledTimes(1)
  })

  it('mute is safe when no video mounted', () => {
    const { result } = renderHook(() => useBackgroundVideo(), { wrapper })
    expect(() => act(() => result.current.mute())).not.toThrow()
    expect(() => act(() => result.current.unmute())).not.toThrow()
    expect(() => act(() => result.current.toggleMute())).not.toThrow()
  })
})
