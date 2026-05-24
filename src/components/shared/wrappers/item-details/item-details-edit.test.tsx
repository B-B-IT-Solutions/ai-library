import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument } from "@tests";

import {
   ItemDetailsEdit,
   ItemDetailsEditBody,
   ItemDetailsEditBreadcrumbs,
   ItemDetailsEditContent,
   ItemDetailsEditHeader,
} from "./item-details-edit";

describe("ItemDetailsEdit rendering tests", () => {
   it("ItemDetailsEdit - renders with testid and children - test", async () => {
      const { container } = render(
         <ItemDetailsEdit data-testid="item-details-edit">
            <div data-testid="test-child" />
         </ItemDetailsEdit>
      );

      await waitFor(() => {
         assertInDocument(screen.getByTestId("item-details-edit"));
         assertInDocument(screen.getByTestId("test-child"));
      });

      expect(container).toMatchSnapshot();
   });

   it("ItemDetailsEditHeader - renders with testid and children - test", async () => {
      const { container } = render(
         <ItemDetailsEditHeader data-testid="item-details-edit-header">
            <div data-testid="test-child" />
         </ItemDetailsEditHeader>
      );

      await waitFor(() => {
         assertInDocument(screen.getByTestId("item-details-edit-header"));
         assertInDocument(screen.getByTestId("test-child"));
      });

      expect(container).toMatchSnapshot();
   });

   it("ItemDetailsEditContent - renders with testid and children - test", async () => {
      const { container } = render(
         <ItemDetailsEditContent data-testid="item-details-edit-content">
            <div data-testid="test-child" />
         </ItemDetailsEditContent>
      );

      await waitFor(() => {
         assertInDocument(screen.getByTestId("item-details-edit-content"));
         assertInDocument(screen.getByTestId("test-child"));
      });

      expect(container).toMatchSnapshot();
   });

   it("ItemDetailsEditBreadcrumbs - renders with testid and children - test", async () => {
      const { container } = render(
         <ItemDetailsEditBreadcrumbs data-testid="item-details-edit-breadcrumbs">
            <div data-testid="test-child" />
         </ItemDetailsEditBreadcrumbs>
      );

      await waitFor(() => {
         assertInDocument(screen.getByTestId("item-details-edit-breadcrumbs"));
         assertInDocument(screen.getByTestId("test-child"));
      });

      expect(container).toMatchSnapshot();
   });

   it("ItemDetailsEditBody - renders with testid and children - test", async () => {
      const { container } = render(
         <ItemDetailsEditBody data-testid="item-details-edit-body">
            <div data-testid="test-child" />
         </ItemDetailsEditBody>
      );

      await waitFor(() => {
         assertInDocument(screen.getByTestId("item-details-edit-body"));
         assertInDocument(screen.getByTestId("test-child"));
      });

      expect(container).toMatchSnapshot();
   });

   it("ItemDetailsEdit - renders full composition - test", async () => {
      const { container } = render(
         <ItemDetailsEdit data-testid="item-details-edit">
            <ItemDetailsEditHeader data-testid="item-details-edit-header">
               <div data-testid="test-header" />
            </ItemDetailsEditHeader>
            <ItemDetailsEditContent data-testid="item-details-edit-content">
               <ItemDetailsEditBreadcrumbs data-testid="item-details-edit-breadcrumbs">
                  <div data-testid="test-breadcrumbs" />
               </ItemDetailsEditBreadcrumbs>
               <ItemDetailsEditBody data-testid="item-details-edit-body">
                  <div data-testid="test-body" />
               </ItemDetailsEditBody>
            </ItemDetailsEditContent>
         </ItemDetailsEdit>
      );

      await waitFor(() => {
         assertInDocument(screen.getByTestId("item-details-edit"));
         assertInDocument(screen.getByTestId("item-details-edit-header"));
         assertInDocument(screen.getByTestId("item-details-edit-content"));
         assertInDocument(screen.getByTestId("item-details-edit-breadcrumbs"));
         assertInDocument(screen.getByTestId("item-details-edit-body"));
         assertInDocument(screen.getByTestId("test-header"));
         assertInDocument(screen.getByTestId("test-breadcrumbs"));
         assertInDocument(screen.getByTestId("test-body"));
      });

      expect(container).toMatchSnapshot();
   });
});
