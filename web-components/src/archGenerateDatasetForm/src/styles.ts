import { css } from "lit";
import { global } from "../../lib/styles";

export default [
  global,
  css`
    label {
      background-color: #000;
      color: #fff;
      padding: 0.5rem;
      display: block;
      font-size: 0.9rem;
      font-weight: bold;
    }

    select[name="source-collection"] {
      width: 100%;
    }

    label[for="job-category"] {
      margin-top: 1rem;
    }

    arch-job-category-section {
      flex-grow: 1;
    }

    .category-header {
      padding: 0.5rem;
      background-color: #eee;
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
