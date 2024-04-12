import { css } from "styled-components";

const sizes = {
  large: 1281,
  medium: 1024,
  small: 500,
};

const media = Object.entries(sizes).reduce((acc, [key, value]) => {
  return {
    ...acc,
    [key]: (first, ...interpolations) => css`
      @media (max-width: ${value}px) {
        ${css(first, ...interpolations)}
      }
    `,
  };
}, {});

export { media };
