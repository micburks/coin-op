// @flow

import React from 'react';
import styled from 'styled-components';

const TextInput = styled.input`
  border: 1px solid rgba(0, 0, 0, 0.6);
  display: block;
  padding: 8px 8px;
  margin: 4px 0;
  width: 100%;
`;

const SubmitInput = styled.input`
  border: 1px solid rgba(0, 0, 0, 0.75);
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  display: block;
  padding: 4px 8px;
  margin: 8px 0 4px;
`;

export default function SignupForm (props) {
  const [email, setEmail] = React.useState('');

  function submit(e) {
    e.preventDefault();
    if (email !== '') {
      props.onSubmit({email});
    }
  }

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  return (
    <form onSubmit={submit}>
      <TextInput
        type="text"
        placeholder="email@site.com"
        value={email} onChange={handleEmailChange}
      />
      <SubmitInput type="submit" value="Submit!" />
    </form>
  );
}
