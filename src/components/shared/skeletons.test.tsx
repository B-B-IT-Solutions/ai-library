import { render } from "@testing-library/react";

import {
   CartItemSkeleton,
   OrderCardSkeleton,
   PageHeaderSkeleton,
   ProductCardSkeleton,
   TemplateCardSkeleton,
} from "./skeletons";

const assertAnimatePulse = (container: HTMLElement) => {
   const animatedElements = container.querySelectorAll(".animate-pulse");
   expect(animatedElements.length).toBeGreaterThan(0);
};

describe("ProductCardSkeleton rendering tests", () => {
   it("ProductCardSkeleton rendered test", () => {
      const { container } = render(<ProductCardSkeleton />);

      assertAnimatePulse(container);

      expect(container).toMatchSnapshot();
   });
});

describe("OrderCardSkeleton rendering tests", () => {
   it("OrderCardSkeleton rendered test", () => {
      const { container } = render(<OrderCardSkeleton />);

      assertAnimatePulse(container);

      expect(container).toMatchSnapshot();
   });
});

describe("TemplateCardSkeleton rendering tests", () => {
   it("TemplateCardSkeleton rendered test", () => {
      const { container } = render(<TemplateCardSkeleton />);

      assertAnimatePulse(container);

      expect(container).toMatchSnapshot();
   });
});

describe("CartItemSkeleton rendering tests", () => {
   it("CartItemSkeleton rendered test", () => {
      const { container } = render(<CartItemSkeleton />);

      assertAnimatePulse(container);

      expect(container).toMatchSnapshot();
   });
});

describe("PageHeaderSkeleton rendering tests", () => {
   it("PageHeaderSkeleton rendered test", () => {
      const { container } = render(<PageHeaderSkeleton />);

      assertAnimatePulse(container);

      expect(container).toMatchSnapshot();
   });
});
