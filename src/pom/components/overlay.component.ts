import { Locator } from "@playwright/test";
import { Component, IComponent } from "@pom/base.page";

interface IOverlay extends IComponent {
  close: Locator
}

class Overlay extends Component implements IOverlay {

  get close(): Locator {
    return this.component.getByRole('button').first()
  }
}

export { Overlay, IOverlay }
