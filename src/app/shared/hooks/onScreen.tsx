import { type RefObject, useEffect, useMemo, useState } from "react"

export default function useOnScreen(ref: RefObject<HTMLElement>) {

    const [isIntersecting, setIntersecting] = useState(false)
    console.log(ref.current)
    const observer = useMemo(() => new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),{threshold: .5}
    ), [ref])
  
  
    useEffect(() => {
      observer.observe(ref.current!)
      return () => observer.disconnect()
    }, [])
  
    return isIntersecting
  }