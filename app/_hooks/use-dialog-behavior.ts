"use client";

import {
  useCallback,
  useEffect,
  type KeyboardEvent,
  type RefObject,
} from "react";

const focusableDialogElementSelector = [
  "a[href]",
  "button:not([disabled])",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

function getFocusableDialogElements(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(focusableDialogElementSelector),
  ).filter(
    (element) =>
      element.getAttribute("aria-hidden") !== "true" &&
      element.getClientRects().length > 0,
  );
}

type ElementRef<T extends HTMLElement> = RefObject<T | null>;

export function useDialogBehavior<
  TPanel extends HTMLElement,
  TInitialFocus extends HTMLElement = HTMLElement,
  TRestoreFocus extends HTMLElement = HTMLElement,
>({
  initialFocusRef,
  onClose,
  panelRef,
  restoreFocusRef,
}: {
  initialFocusRef?: ElementRef<TInitialFocus>;
  onClose: () => void;
  panelRef: ElementRef<TPanel>;
  restoreFocusRef?: ElementRef<TRestoreFocus>;
}) {
  useEffect(() => {
    const scrollY = window.scrollY;
    const restoreFocusElement = restoreFocusRef?.current ?? null;
    const previousBodyPosition = document.body.style.position;
    const previousBodyTop = document.body.style.top;
    const previousBodyWidth = document.body.style.width;
    const previousBodyOverflow = document.body.style.overflow;

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    const focusFrame = window.requestAnimationFrame(() => {
      const panel = panelRef.current;
      const firstFocusableElement = panel
        ? getFocusableDialogElements(panel)[0]
        : null;
      const focusTarget = initialFocusRef?.current ?? firstFocusableElement;

      (focusTarget ?? panel)?.focus({ preventScroll: true });
    });

    const handleDocumentKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", handleDocumentKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleDocumentKeyDown);
      document.body.style.position = previousBodyPosition;
      document.body.style.top = previousBodyTop;
      document.body.style.width = previousBodyWidth;
      document.body.style.overflow = previousBodyOverflow;
      window.scrollTo(0, scrollY);
      window.requestAnimationFrame(() => {
        restoreFocusElement?.focus({ preventScroll: true });
      });
    };
  }, [initialFocusRef, onClose, panelRef, restoreFocusRef]);

  return useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key !== "Tab") {
        return;
      }

      const panel = panelRef.current;

      if (!panel) {
        return;
      }

      const focusableElements = getFocusableDialogElements(panel);

      if (focusableElements.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }

      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement =
        focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;
      const activeElementIndex = focusableElements.findIndex(
        (element) => element === activeElement,
      );

      event.preventDefault();

      if (event.shiftKey) {
        if (
          activeElement === firstFocusableElement ||
          activeElement === panel ||
          !activeElement ||
          !panel.contains(activeElement) ||
          activeElementIndex <= 0
        ) {
          lastFocusableElement.focus();
          return;
        }

        focusableElements[activeElementIndex - 1].focus();
        return;
      }

      if (
        activeElement === lastFocusableElement ||
        activeElement === panel ||
        !activeElement ||
        !panel.contains(activeElement) ||
        activeElementIndex === -1 ||
        activeElementIndex >= focusableElements.length - 1
      ) {
        firstFocusableElement.focus();
        return;
      }

      focusableElements[activeElementIndex + 1].focus();
    },
    [panelRef],
  );
}
