import { isArray } from "es-toolkit/compat";

export const assertInDocument = (component: HTMLElement | SVGSVGElement) => {
   expect(component).toBeInTheDocument();
};

export const assertNotInDocument = (
   component: HTMLElement | SVGSVGElement | null
) => {
   expect(component).not.toBeInTheDocument();
};

export const assertVisbile = (component: HTMLElement) => {
   expect(component).toBeVisible();
};

export const assertNotVisible = (component: HTMLElement | null) => {
   expect(component).not.toBeVisible();
};

export const assertHasClass = (
   component: HTMLElement,
   cssClasses: string | string[]
) => {
   if (isArray(cssClasses)) {
      expect(component).toHaveClass(...cssClasses);
   } else {
      expect(component).toHaveClass(cssClasses);
   }
};

export const assertHasNoClass = (
   component: HTMLElement,
   cssClasses: string | string[]
) => {
   if (isArray(cssClasses)) {
      expect(component).not.toHaveClass(...cssClasses);
   } else {
      expect(component).not.toHaveClass(cssClasses);
   }
};

export const assertHasAttributeWithValue = (
   component: HTMLElement,
   attribute: string,
   value: string
) => {
   assertHasAttribute(component, attribute);
   expect(component.getAttribute(attribute)).toEqual(value);
};

export const assertHasAttributeWithValueContaining = (
   component: HTMLElement,
   attribute: string,
   value: string
) => {
   assertHasAttribute(component, attribute);
   expect(component.getAttribute(attribute)).toContain(value);
};

export const assertHasAttribute = (
   component: HTMLElement,
   attribute: string
) => {
   expect(component).toHaveAttribute(attribute);
};

export const assertHasNoAttribute = (
   component: HTMLElement,
   attribute: string
) => {
   expect(component).not.toHaveAttribute(attribute);
};

export const assertHasStyle = (
   component: HTMLElement,
   css: string | Record<string, unknown>
) => {
   expect(component).toHaveStyle(css);
};

export const assertHasNoStyle = (
   component: HTMLElement,
   css: string | Record<string, unknown>
) => {
   expect(component).not.toHaveStyle(css);
};

export const assertStringifyEqual = <T>(obj1: T, obj2: T) => {
   expect(JSON.stringify(obj1)).toEqual(JSON.stringify(obj2));
};
