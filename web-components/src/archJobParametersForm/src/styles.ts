import { css } from "lit";

import { global } from "../../lib/styles";
import defaultFormStyles from "../../archJsonSchemaForm/src/styles";

export default [
  global,
  ...defaultFormStyles,
  css`
    div.input-block {
      background-color: #f8f8f8;
      padding-bottom: 0.5rem;
    }

    label {
      background-color: #666;
      color: #fff;
      padding: 0.5rem;
      display: block;
      font-size: 0.9rem;
      /* Make it a little brighter than the default background color */
      filter: brightness(1.2);
    }
  `,
];
