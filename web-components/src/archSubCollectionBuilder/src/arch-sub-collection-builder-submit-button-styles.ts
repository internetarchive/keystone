import { css } from "lit";

import { global } from "../../lib/styles";

export default [
  global,
  css`
    ul {
      padding-left: 2rem;
    }

    dt {
      margin-left: 1rem;
      display: inline-block;
      font-weight: normal;
    }

    dt:first-of-type {
      margin-top: 1rem;
    }

    dd:after {
      content: "";
      padding: 0;
    }

    em {
      display: block;
      margin: 0.3rem 0;
      margin-left: 1rem;
    }

    span.new-name,
    li.input-collection,
    span.filter-value {
      font-weight: bold;
    }
  `,
];
