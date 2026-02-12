import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Composable: элемент появляется при скролле
 * @param {number} delay — задержка в мс
 * @param {number} threshold — процент видимости (0-1)
 */
export function useReveal(delay = 0, threshold = 0.1) {
  const elRef = ref(null)
  const visible = ref(false)
  let observer = null

  onMounted(() => {
    if (!elRef.value) return
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => { visible.value = true }, delay)
          observer.disconnect()
        }
      },
      { threshold }
    )
    observer.observe(elRef.value)
  })

  onUnmounted(() => {
    if (observer) observer.disconnect()
  })

  return { elRef, visible }
}
