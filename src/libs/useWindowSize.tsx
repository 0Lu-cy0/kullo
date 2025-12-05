import { useLayoutEffect, useState } from 'react'

const useWindowSize = (width: number, isLess = false) => {
  const [size, setSize] = useState(false)
  useLayoutEffect(() => {
    function updateSize() {
      const currentWidth = isLess ? window.innerWidth < width : window.innerWidth > width
      setSize(currentWidth)
    }
    window.addEventListener('resize', updateSize)
    updateSize()
    return () => window.removeEventListener('resize', updateSize)
  }, [isLess, width])
  return size
}

const useIsLaptop = () => useWindowSize(1507, true)

const useIsDesktop = () => useWindowSize(1200)

const useIsCalendar = () => useWindowSize(1233, true)

const useIsTablet = () => useWindowSize(991, true)

const useIsMobile = () => useWindowSize(768, true)

export default {
  useIsLaptop,
  useIsDesktop,
  useIsMobile,
  useIsTablet,
  useWindowSize,
  useIsCalendar,
}
