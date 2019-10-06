import { Modifier } from "./modifers"

export class Properties {
  weight: number = 0;
  speed: number = 0;
  size: number = 0;
  height: number = 0;

  constructor(weight: number, speed: number, size: number, height: number) {
    this.weight = weight;
    this.speed = speed;
    this.size = size;
    this.height = height;
  }

  apply(properties: Properties): void {
    this.weight = properties.weight;
    this.speed = properties.speed;
    this.size = properties.size;
    this.height = properties.height;
  }
}

export class BaseActor {
    modifiers: Modifier[] = [];
    defaultProperties: Properties;
    modifiedProperties: Properties;

    constructor(defaultProperties: Properties) {
      this.defaultProperties = defaultProperties;
      this.modifiedProperties = defaultProperties;
    }

    setModifiers(modifers: Modifier[] = []) {
      this.modifiers = modifers;
    }

    resetProperties() {
      this.modifiedProperties.apply(this.defaultProperties);
    }

    updateModifiedProperties() {
      this.resetProperties();
      this.modifiers.forEach((modifier) => modifier(this.modifiedProperties))
    }
}
