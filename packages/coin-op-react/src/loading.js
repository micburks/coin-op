// @flow

import React from 'react';
import styled from 'styled-components';

const Small = styled.small`
  color: rgba(0, 0, 0, 0.6);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
`;

const Body = styled.p`
  color: rgba(0, 0, 0, 0.75);
  font-size: 16px;
  font-weight: 300;
  margin: 8px 0;
`;

export default function Loading (props) {
  const [n, setN] = React.useState(0);
  const ellipsis = '.'.repeat(n);
  React.useEffect(() => {
    const timerId = setTimeout(() => {
      setN((n + 1) % 4);
    }, 400);
    return () => clearTimeout(timerId);
  })
  return (
    <div>
      <Small>Loading{ellipsis}</Small>
      <Body>{props.text}</Body>
    </div>
  );
}
