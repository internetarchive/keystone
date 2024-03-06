import { css } from "lit";
import {
  global,
  archLogoBackgroundColor,
  archLogoForegroundColor,
} from "../../lib/styles";

export default [
  global,
  css`
    label {
      background-color: ${archLogoBackgroundColor};
      color: ${archLogoForegroundColor};
      padding: 0.5rem;
      display: block;
      font-size: 0.9rem;
      font-weight: bold;
    }

    select[name="source-collection"] {
      width: 100%;
      direction: rtl;
      text-align: left;
    }

    select[name="source-collection"] > option {
      direction: ltr;
    }

    label[for="job-category"] {
      margin-top: 1rem;
    }

    arch-job-category-section {
      flex-grow: 1;
    }

    .category-header {
      padding: 1rem 0 0.5rem 0;
      background-color: #eee;
    }

    .category-title {
      font-weight: bold;
      font-size: 1.5rem;
    }

    .category-image {
      float: left;
      max-height: 5em;
      width: auto;
    }

    sp-tabs[name="job-tabs"] sp-tab {
      padding: 0 1rem;
    }

    sp-tabs[name="job-tabs"] sp-tab[selected] {
      background-color: #fff;
      margin-right: 0;
    }

    sp-tabs[name="job-tabs"] sp-tab-panel > arch-job-card {
      flex-grow: 1;
      background-color: #fff;
      padding: 1rem;
    }
  `,
];
