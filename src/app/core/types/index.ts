

export type scheme = {
  id?: string,
  name: string,
  path: string,
  description?: string,
  icon: string,
  properties?: Record<string, property>,
  subcollections?: Array<scheme>
}

export type property = {
  slug: string,
  name: string,
  description?: string,
  datatype: string,
  url?: string,
  multiline?: boolean,
  storage?: {
    acceptedFiles: Array<string>,
    storagePath: string,
  },
  properties?: Record<string, property>
  of?: {
    datatype: string,
    properties?: Record<string, property>
    url?: string,
    multiline?: boolean,
    storage?: {
      acceptedFiles: Array<string>,
      storagePath: string,
    },
    value?: Array<string | Record<string, property>>
  }
  parent?: property
  value?: string
}

export type PropertyValues = {
  [x: string]: string | Array<string | PropertyValues> | PropertyValues | undefined;
}

export const parsePropertyValues = (properties: Record<string, property>, values?: PropertyValues): Record<string, property> => {
  if(values === undefined) return properties
  let parseProperty: Record<string, property> = properties
  for (let key in properties) {
    if (properties[key].datatype === 'map' && Object.keys(values[key]!).length > 0 && properties[key].properties) {
      parseProperty[key].properties = parsePropertyValues(properties[key].properties, (values[key] as PropertyValues))
    }
    if (properties[key].datatype === 'list' && properties[key].of && Array.isArray(values[key])) {
      parseProperty[key].of!.value = (values[key] as (string | PropertyValues)[]).map((e) => {
        if (properties[key].of?.properties && Object.keys(e).length > 0 ) {
          return parsePropertyValues(properties[key].of.properties, (e as PropertyValues))
        }
        if (typeof e === "string") return e
        return ""
      })
    }
    else {
      parseProperty[key].value = values[key] as string
    }
  }
  return parseProperty
}
export const parsePropertyToValues = (properties: Record<string, property>): PropertyValues => {
  let parseProperty: PropertyValues = {}
  for (let key in properties) {
    if (properties[key].datatype === 'map' && properties[key].properties) {
      parseProperty[key] = parsePropertyToValues(properties[key].properties)
    }
    else if (properties[key].datatype === 'list' && properties[key].of && properties[key].of.value) {
      parseProperty[key] = properties[key].of.value.map((e) => {
        if (typeof e === "string") return e
        if (properties[key].of?.properties && Object.keys(e).length > 0 ) {
          return parsePropertyToValues(properties[key].of.properties)
        }
        return ""
      })
    }
    else {
      parseProperty[key] = properties[key].value
    }
  }
  return parseProperty
}