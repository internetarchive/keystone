import { css } from "lit";

import { global } from "../../lib/styles";

export default [
  global,
  css`
    h3 {
      margin-block-start: 0;
      margin-block-end: 0.5rem;
      font-size: 1rem;
    }

    ul {
      line-height: 1.6rem;
      font-style: italic;
    }

    button {
      padding: 0;
      background-color: transparent;
      margin-left: 1rem;
      text-decoration: underline;
      color: red;
      font-size: 0.8em;
    }

    label {
      margin-left: 1.2rem;
    }

    select {
      padding: 0.2rem;
      border-radius: 8px;
    }
  `,
];
