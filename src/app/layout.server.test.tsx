import {renderToStaticMarkup} from "react-dom/server";

import RootLayout from "./layout";

describe("RootLayout server rendering tests", () => {
  it("RootLayout rendered", async () => {
    const html = renderToStaticMarkup(
      <RootLayout>
        <div>test 1</div>
      </RootLayout>
    );
    expect(html).toContain('data-testid="root-layout"');
  });
});
