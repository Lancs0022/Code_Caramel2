const ALL_PHOTOS = [
  // Phase 2 main photos
  '/photos/ai-1.png',
  '/photos/photo-08.jpg',
  '/photos/photo-09.jpg',
  '/photos/ai-2.png',

  // Phase 3 main polaroids & hero images
  '/photos/photo-01.jpg',
  '/photos/photo-12.jpg',
  '/photos/photo-19.jpg',
  '/photos/photo-05.jpg',
  '/photos/photo-03.jpg',
  '/photos/photo-13.jpg',
  '/photos/photo-02.jpg',
  '/photos/photo-14.jpg',

  // Remaining photos
  '/photos/photo-04.jpg',
  '/photos/photo-06.jpg',
  '/photos/photo-07.jpg',
  '/photos/photo-10.jpg',
  '/photos/photo-11.jpg',
  '/photos/photo-15.jpg',
  '/photos/photo-16.jpg',
  '/photos/photo-17.jpg',
  '/photos/photo-18.jpg',
  '/photos/photo-20.jpg',
  '/photos/photo-21.jpg',
  '/photos/photo-22.jpg',
]

/**
 * Preloads images progressively (max 2 concurrently) so as not to overwhelm network
 * bandwidth during initial animations, while ensuring images are cached before being viewed.
 */
export function preloadAllPhotos(concurrency = 2) {
  const queue = [...ALL_PHOTOS]

  function loadNext() {
    if (queue.length === 0) return

    const url = queue.shift()!
    const img = new Image()

    const onDone = () => {
      loadNext()
    }

    img.onload = onDone
    img.onerror = onDone
    img.src = url
  }

  for (let i = 0; i < concurrency; i++) {
    loadNext()
  }
}
