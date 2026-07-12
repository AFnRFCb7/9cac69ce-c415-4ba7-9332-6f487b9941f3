import { watchEffect } from "vue";
import { cms } from "@shared/state/cms";

export function useSiteTitle(getTitle?: () => string | undefined) {
  watchEffect(() => {
    const title =
      getTitle?.() ??
      cms.data?.metadata?.site?.title;

    if (title) {
      document.title = title;
    }
  });
}