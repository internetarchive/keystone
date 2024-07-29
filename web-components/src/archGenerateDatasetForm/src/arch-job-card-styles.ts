import { css } from "lit";
import { global, Bootstrap4Alerts } from "../../lib/styles";

export default [
  global,
  Bootstrap4Alerts,
  css`
    dl {
      padding-inline-start: 1rem;
      line-height: 1.4rem;
    }

    dt {
      display: inline-block;
      font-weight: normal;
    }

    dd {
      font-weight: bold;
    }

    dd:after {
      content: "";
      padding: 0;
    }

    div > h3 {
      margin-top: 0;
    }

    div > p {
      line-height: 1.2rem;
    }

    button.job-button {
      cursor: wait;
    }

    button.job-button.primary {
      cursor: pointer;
    }

    p.history > a {
      text-decoration: underline;
    }

    /* Disabled button text style should match ArchLoadingIndicator */
    button:disabled {
      font-style: italic;
      color: #666;
    }
  `,
];
