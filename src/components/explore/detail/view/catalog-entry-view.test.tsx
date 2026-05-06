import { getByTestId, screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";

import { CatalogEntryView } from "./catalog-entry-view";

const assertRendered = () => {
   const view = screen.getByTestId("catalog-entry-view");
   const header = screen.getByTestId("header");
   const cta = screen.getByTestId("cta");

   assertInDocument(view);
   assertInDocument(header);
   assertInDocument(cta);
};

const assertFieldsRendered = () => {
   const fields = screen.getByTestId("fields");
   const fieldItems = screen.getAllByTestId("field");

   assertInDocument(fields);
   expect(fieldItems.length).toBeGreaterThan(0);
};

const assertFieldsNotRendered = () => {
   const fields = screen.queryByTestId("fields");
   assertNotInDocument(fields);
};

const assertRelatedEntriesRendered = () => {
   const entries = screen.getByTestId("related-entries");
   const entryItems = screen.getAllByTestId("related-entry");

   assertInDocument(entries);
   expect(entryItems.length).toBeGreaterThan(0);
};

const assertRelatedEntriesNotRendered = () => {
   const entries = screen.queryByTestId("related-entries");
   assertNotInDocument(entries);
};

const assertRegisterBtnRendered = () => {
   const header = screen.getByTestId("header");
   const cta = screen.getByTestId("cta");
   const headerCopyBtn = getByTestId(header, "catalog-entry-register-btn");
   const ctaCopyBtn = getByTestId(header, "catalog-entry-register-btn");

   assertInDocument(header);
   assertInDocument(cta);
   assertInDocument(headerCopyBtn);
   assertInDocument(ctaCopyBtn);
};

const assertCopyBtnRendered = () => {
   const header = screen.getByTestId("header");
   const cta = screen.getByTestId("cta");
   const headerCopyBtn = getByTestId(header, "catalog-entry-copy-btn");
   const ctaCopyBtn = getByTestId(header, "catalog-entry-copy-btn");

   assertInDocument(header);
   assertInDocument(cta);
   assertInDocument(headerCopyBtn);
   assertInDocument(ctaCopyBtn);
};

describe("CatalogEntryView rendering tests", () => {
   it("relatedEntries empty - test", async () => {
      const entry = dtestData.dCatalogEntry(1);

      const { container } = render(
         <CatalogEntryView
            entry={entry}
            isAuthenticated={false}
            relatedEntries={[]}
         />
      );

      await waitFor(() => {
         assertRendered();
         assertFieldsRendered();
         assertRelatedEntriesNotRendered();
         assertRegisterBtnRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("relatedEntries defined - test", async () => {
      const entry = dtestData.dCatalogEntry(1);
      const relatedEntries = dtestData.dCatalogEntrySummaries();

      const { container } = render(
         <CatalogEntryView
            entry={entry}
            isAuthenticated={true}
            relatedEntries={relatedEntries}
         />
      );

      await waitFor(() => {
         assertRendered();
         assertFieldsRendered();
         assertRelatedEntriesRendered();
         assertCopyBtnRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("fields empty - test", async () => {
      const entry = dtestData.dCatalogEntry(1);
      entry.fields = [];
      const relatedEntries = dtestData.dCatalogEntrySummaries();

      const { container } = render(
         <CatalogEntryView
            entry={entry}
            isAuthenticated={true}
            relatedEntries={relatedEntries}
         />
      );

      await waitFor(() => {
         assertRendered();
         assertFieldsNotRendered();
         assertCopyBtnRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

// describe("CatalogEntryView - fields section - rendering tests", () => {
//    it("renders fields section when entry has fields - test", async () => {
//       const entry = dtestData.dCatalogEntry(1);
//       renderView(entry);

//       await waitFor(() => {
//          expect(
//             screen.getByText(`Formularfelder (${entry.fields.length})`)
//          ).toBeInTheDocument();
//       });
//    });

//    it("does not render fields section when entry has no fields - test", async () => {
//       const entry: DCatalogEntry = {
//          ...dtestData.dCatalogEntry(1),
//          fields: [],
//       };
//       renderView(entry);

//       await waitFor(() => {
//          expect(screen.queryByText(/Formularfelder/)).not.toBeInTheDocument();
//       });
//    });

//    it("renders a card for each field - test", async () => {
//       const entry = dtestData.dCatalogEntry(1);
//       renderView(entry);

//       await waitFor(() => {
//          entry.fields.forEach((field) => {
//             assertInDocument(
//                screen.getByTestId(`explore-field-preview-${field.name}`)
//             );
//          });
//       });
//    });

//    it("renders field label - test", async () => {
//       const field = dtestData.dCatalogEntryField(1);
//       const entry: DCatalogEntry = {
//          ...dtestData.dCatalogEntry(1),
//          fields: [field],
//       };
//       renderView(entry);

//       await waitFor(() => {
//          expect(screen.getByText(field.label)).toBeInTheDocument();
//       });
//    });

//    it("renders required marker for required fields - test", async () => {
//       const field = { ...dtestData.dCatalogEntryField(1), required: true };
//       const entry: DCatalogEntry = {
//          ...dtestData.dCatalogEntry(1),
//          fields: [field],
//       };
//       renderView(entry);

//       await waitFor(() => {
//          const card = screen.getByTestId(`explore-field-preview-${field.name}`);
//          expect(card).toHaveTextContent("*");
//       });
//    });

//    it("does not render required marker for non-required fields - test", async () => {
//       const field = { ...dtestData.dCatalogEntryField(1), required: false };
//       const entry: DCatalogEntry = {
//          ...dtestData.dCatalogEntry(1),
//          fields: [field],
//       };
//       renderView(entry);

//       await waitFor(() => {
//          const card = screen.getByTestId(`explore-field-preview-${field.name}`);
//          expect(card).not.toHaveTextContent("*");
//       });
//    });

//    it("renders field description when present - test", async () => {
//       const field = {
//          ...dtestData.dCatalogEntryField(1),
//          description: "A helpful description",
//       };
//       const entry: DCatalogEntry = {
//          ...dtestData.dCatalogEntry(1),
//          fields: [field],
//       };
//       renderView(entry);

//       await waitFor(() => {
//          expect(screen.getByText("A helpful description")).toBeInTheDocument();
//       });
//    });

//    it("does not render field description when null - test", async () => {
//       const field = { ...dtestData.dCatalogEntryField(1), description: null };
//       const entry: DCatalogEntry = {
//          ...dtestData.dCatalogEntry(1),
//          fields: [field],
//       };
//       renderView(entry);

//       await waitFor(() => {
//          const card = screen.getByTestId(`explore-field-preview-${field.name}`);
//          expect(card).not.toHaveTextContent("Field description");
//       });
//    });

//    it.each([
//       ["TEXT", "Text"],
//       ["TEXTAREA", "Mehrzeiliger Text"],
//       ["SELECT", "Auswahl"],
//       ["CHECKBOX", "Checkbox"],
//       ["RADIO", "Radio-Auswahl"],
//       ["NUMBER", "Zahl"],
//       ["DATE", "Datum"],
//       ["EMAIL", "E-Mail"],
//    ])(
//       "renders correct label for field type %s - test",
//       async (type, expectedLabel) => {
//          const field = {
//             ...dtestData.dCatalogEntryField(1),
//             type: type as any,
//          };
//          const entry: DCatalogEntry = {
//             ...dtestData.dCatalogEntry(1),
//             fields: [field],
//          };
//          renderView(entry);

//          await waitFor(() => {
//             expect(screen.getByText(expectedLabel)).toBeInTheDocument();
//          });
//       }
//    );

//    it("renders raw type for unknown field type - test", async () => {
//       const field = {
//          ...dtestData.dCatalogEntryField(1),
//          type: "UNKNOWN_TYPE" as any,
//       };
//       const entry: DCatalogEntry = {
//          ...dtestData.dCatalogEntry(1),
//          fields: [field],
//       };
//       renderView(entry);

//       await waitFor(() => {
//          expect(screen.getByText("UNKNOWN_TYPE")).toBeInTheDocument();
//       });
//    });

//    it("renders field options as badges when options exist - test", async () => {
//       const field = {
//          ...dtestData.dCatalogEntryField(1),
//          type: "SELECT" as any,
//          options: ["Option A", "Option B", "Option C"],
//       };
//       const entry: DCatalogEntry = {
//          ...dtestData.dCatalogEntry(1),
//          fields: [field],
//       };
//       renderView(entry);

//       await waitFor(() => {
//          expect(screen.getByText("Option A")).toBeInTheDocument();
//          expect(screen.getByText("Option B")).toBeInTheDocument();
//          expect(screen.getByText("Option C")).toBeInTheDocument();
//       });
//    });

//    it("does not render options section when options are empty - test", async () => {
//       const field = { ...dtestData.dCatalogEntryField(1), options: [] };
//       const entry: DCatalogEntry = {
//          ...dtestData.dCatalogEntry(1),
//          fields: [field],
//       };
//       renderView(entry);

//       await waitFor(() => {
//          const card = screen.getByTestId(`explore-field-preview-${field.name}`);
//          expect(card).not.toHaveTextContent("Option");
//       });
//    });
// });

// describe("CatalogEntryView - related entries - rendering tests", () => {
//    it("renders related entries section when relatedEntries is non-empty - test", async () => {
//       const entry = dtestData.dCatalogEntry(1);
//       const related = dtestData.dCatalogEntrySummaries(2);
//       renderView(entry, false, related);

//       await waitFor(() => {
//          expect(
//             screen.getByText("Mehr aus dieser Kategorie")
//          ).toBeInTheDocument();
//       });
//    });

//    it("does not render related entries section when relatedEntries is empty - test", async () => {
//       const entry = dtestData.dCatalogEntry(1);
//       renderView(entry, false, []);

//       await waitFor(() => {
//          expect(
//             screen.queryByText("Mehr aus dieser Kategorie")
//          ).not.toBeInTheDocument();
//       });
//    });

//    it("does not render related entries section by default - test", async () => {
//       const entry = dtestData.dCatalogEntry(1);
//       renderView(entry);

//       await waitFor(() => {
//          expect(
//             screen.queryByText("Mehr aus dieser Kategorie")
//          ).not.toBeInTheDocument();
//       });
//    });

//    it("renders a link for each related entry - test", async () => {
//       const entry = dtestData.dCatalogEntry(1);
//       const related = dtestData.dCatalogEntrySummaries(2);
//       renderView(entry, false, related);

//       await waitFor(() => {
//          const links = screen.getAllByTestId("explore-related-entry");
//          expect(links).toHaveLength(2);
//       });
//    });

//    it("renders related entry titles - test", async () => {
//       const entry = dtestData.dCatalogEntry(1);
//       const related = dtestData.dCatalogEntrySummaries(2);
//       renderView(entry, false, related);

//       await waitFor(() => {
//          related.forEach((r) => {
//             expect(screen.getByText(r.title)).toBeInTheDocument();
//          });
//       });
//    });

//    it("renders related entry descriptions - test", async () => {
//       const entry = dtestData.dCatalogEntry(1);
//       const related = dtestData.dCatalogEntrySummaries(2);
//       renderView(entry, false, related);

//       await waitFor(() => {
//          related.forEach((r) => {
//             expect(screen.getByText(r.description)).toBeInTheDocument();
//          });
//       });
//    });

//    it("related entry links point to correct href - test", async () => {
//       const entry = dtestData.dCatalogEntry(1);
//       const related = dtestData.dCatalogEntrySummaries(2);
//       renderView(entry, false, related);

//       await waitFor(() => {
//          const links = screen.getAllByTestId("explore-related-entry");
//          related.forEach((r, i) => {
//             expect(links[i]).toHaveAttribute("href", `/explore/${r.slug}`);
//          });
//       });
//    });
// });

// describe("CatalogEntryView - CTA section - rendering tests", () => {
//    it("renders CTA section - test", async () => {
//       const entry = dtestData.dCatalogEntry(1);
//       renderView(entry);

//       await waitFor(() => {
//          expect(
//             screen.getByText(
//                "Übernimm diese Vorlage in deine persönliche Library"
//             )
//          ).toBeInTheDocument();
//       });
//    });

//    it("renders CTA subtitle - test", async () => {
//       const entry = dtestData.dCatalogEntry(1);
//       renderView(entry);

//       await waitFor(() => {
//          expect(
//             screen.getByText(
//                "Die Kopie gehört dir – du kannst sie beliebig anpassen."
//             )
//          ).toBeInTheDocument();
//       });
//    });

//    it("renders ExploreCopyButton in CTA section - test", async () => {
//       const entry = dtestData.dCatalogEntry(1);
//       renderView(entry, false);

//       await waitFor(() => {
//          // Called at least twice: once in header, once in CTA
//          expect(ExploreCopyButtonMock).toHaveBeenCalledTimes(2);
//       });
//    });

//    it("passes isAuthenticated=false to CTA ExploreCopyButton - test", async () => {
//       const entry = dtestData.dCatalogEntry(1);
//       renderView(entry, false);

//       await waitFor(() => {
//          expect(ExploreCopyButtonMock).toHaveBeenCalledWith(
//             expect.objectContaining({ isAuthenticated: false }),
//             expect.anything()
//          );
//       });
//    });

//    it("passes isAuthenticated=true to CTA ExploreCopyButton - test", async () => {
//       const entry = dtestData.dCatalogEntry(1);
//       renderView(entry, true);

//       await waitFor(() => {
//          expect(ExploreCopyButtonMock).toHaveBeenCalledWith(
//             expect.objectContaining({ isAuthenticated: true }),
//             expect.anything()
//          );
//       });
//    });
// });
