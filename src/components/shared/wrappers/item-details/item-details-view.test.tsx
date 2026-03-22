import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument } from "@tests";

import {
   ItemDetailsView,
   ItemDetailsViewBody,
   ItemDetailsViewBreadcrumbs,
   ItemDetailsViewContent,
   ItemDetailsViewHeader,
} from "./item-details-view";

describe("ItemDetailsView rendering tests", () => {
   it("ItemDetailsView - renders with testid and children - test", async () => {
      const { container } = render(
         <ItemDetailsView data-testid="item-details-view">
            <div data-testid="test-child" />
         </ItemDetailsView>,
      );

      await waitFor(() => {
         assertInDocument(screen.getByTestId("item-details-view"));
         assertInDocument(screen.getByTestId("test-child"));
      });

      expect(container).toMatchSnapshot();
   });

   it("ItemDetailsViewHeader - renders with testid and children - test", async () => {
      const { container } = render(
         <ItemDetailsViewHeader data-testid="item-details-view-header">
            <div data-testid="test-child" />
         </ItemDetailsViewHeader>,
      );

      await waitFor(() => {
         assertInDocument(screen.getByTestId("item-details-view-header"));
         assertInDocument(screen.getByTestId("test-child"));
      });

      expect(container).toMatchSnapshot();
   });

   it("ItemDetailsViewContent - renders with testid and children - test", async () => {
      const { container } = render(
         <ItemDetailsViewContent data-testid="item-details-view-content">
            <div data-testid="test-child" />
         </ItemDetailsViewContent>,
      );

      await waitFor(() => {
         assertInDocument(screen.getByTestId("item-details-view-content"));
         assertInDocument(screen.getByTestId("test-child"));
      });

      expect(container).toMatchSnapshot();
   });

   it("ItemDetailsViewBreadcrumbs - renders with testid and children - test", async () => {
      const { container } = render(
         <ItemDetailsViewBreadcrumbs data-testid="item-details-view-breadcrumbs">
            <div data-testid="test-child" />
         </ItemDetailsViewBreadcrumbs>,
      );

      await waitFor(() => {
         assertInDocument(screen.getByTestId("item-details-view-breadcrumbs"));
         assertInDocument(screen.getByTestId("test-child"));
      });

      expect(container).toMatchSnapshot();
   });

   it("ItemDetailsViewBody - renders with testid and children - test", async () => {
      const { container } = render(
         <ItemDetailsViewBody data-testid="item-details-view-body">
            <div data-testid="test-child" />
         </ItemDetailsViewBody>,
      );

      await waitFor(() => {
         assertInDocument(screen.getByTestId("item-details-view-body"));
         assertInDocument(screen.getByTestId("test-child"));
      });

      expect(container).toMatchSnapshot();
   });

   it("ItemDetailsView - renders full composition - test", async () => {
      const { container } = render(
         <ItemDetailsView data-testid="item-details-view">
            <ItemDetailsViewHeader data-testid="item-details-view-header">
               <div data-testid="test-header" />
            </ItemDetailsViewHeader>
            <ItemDetailsViewContent data-testid="item-details-view-content">
               <ItemDetailsViewBreadcrumbs data-testid="item-details-view-breadcrumbs">
                  <div data-testid="test-breadcrumbs" />
               </ItemDetailsViewBreadcrumbs>
               <ItemDetailsViewBody data-testid="item-details-view-body">
                  <div data-testid="test-body" />
               </ItemDetailsViewBody>
            </ItemDetailsViewContent>
         </ItemDetailsView>,
      );

      await waitFor(() => {
         assertInDocument(screen.getByTestId("item-details-view"));
         assertInDocument(screen.getByTestId("item-details-view-header"));
         assertInDocument(screen.getByTestId("item-details-view-content"));
         assertInDocument(screen.getByTestId("item-details-view-breadcrumbs"));
         assertInDocument(screen.getByTestId("item-details-view-body"));
         assertInDocument(screen.getByTestId("test-header"));
         assertInDocument(screen.getByTestId("test-breadcrumbs"));
         assertInDocument(screen.getByTestId("test-body"));
      });

      expect(container).toMatchSnapshot();
   });
});
