export type Section = 'theatre' | 'more-projects'

export type Photo = { url: string; alt: string }

export type Track = { url: string; name: string }

export type Project = {
  slug: string
  title: string
  description?: string | undefined
  blurb?: string | undefined
  link?: string | undefined
  soundcloud?: string | undefined
  instagram?: string | undefined
  spotify?: string | undefined
  youtube?: string | undefined
  cover: Photo
  photos: Photo[]
  audio: Track[]
}
