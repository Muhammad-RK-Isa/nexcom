import * as React from "react"
import { isEqual } from "lodash"

type EffectCallback = () => void | (() => void | undefined)
type DependencyList = ReadonlyArray<any>

function useDeepCompareEffect(
  callback: EffectCallback,
  dependencies: DependencyList
): void {
  const currentDependenciesRef = React.useRef<DependencyList>()

  if (!isEqual(currentDependenciesRef.current, dependencies)) {
    currentDependenciesRef.current = dependencies
  }

  React.useEffect(callback, [currentDependenciesRef.current, callback])
}

export default useDeepCompareEffect
