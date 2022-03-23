export interface IProperties {
  id?: number;
  key?: string | null;
  value?: string | null;
}

export class Properties implements IProperties {
  constructor(public id?: number, public key?: string | null, public value?: string | null) {}
}

export function getPropertiesIdentifier(properties: IProperties): number | undefined {
  return properties.id;
}
