import { Attribute } from "@util/types";

function attr(property: Attribute, value: string, token?: string): string {
  return `[${property}${token ?? ''}="${value}"]`
}

export { attr };