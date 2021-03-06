import { currentRenderingInstance } from '../componentRenderUtils'
import { currentInstance, Component } from '../component'
import { Directive } from '../directives'
import { camelize, capitalize } from '@vue/shared'
import { warn } from '../warning'

export function resolveComponent(name: string): Component | undefined {
  return resolveAsset('components', name) as any
}

export function resolveDirective(name: string): Directive | undefined {
  return resolveAsset('directives', name) as any
}

function resolveAsset(type: 'components' | 'directives', name: string) {
  const instance = currentRenderingInstance || currentInstance
  if (instance) {
    let camelized
    const registry = instance[type]
    const res =
      registry[name] ||
      registry[(camelized = camelize(name))] ||
      registry[capitalize(camelized)]
    if (__DEV__ && !res) {
      warn(`Failed to resolve ${type.slice(0, -1)}: ${name}`)
    }
    return res
  } else if (__DEV__) {
    warn(
      `resolve${capitalize(type.slice(0, -1))} ` +
        `can only be used in render() or setup().`
    )
  }
}
