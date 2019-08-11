// @flow

import React from 'react';
import {useMachine, State} from './lib.js';
import {states} from './machine.js';
import styled from 'styled-components';
import ContactForm from './contact-form.js';
import Loading from './loading.js';

const Container = styled.div`
  background-color: white;
  border: 2px solid rgba(0, 0, 0, 0.6);
  border-radius: 2px;
  bottom: 50px;
  padding: 24px 16px 16px;
  margin: auto;
  text-align: left;
  width: 300px;
`;

const Header = styled.h1`
  color: rgba(0, 0, 0, 0.85);
  font-size: 32px;
  font-weight: 700;
  line-height: 32px;
  padding-bottom: 8px;
  margin: 0;
`;

const Body = styled.p`
  color: rgba(0, 0, 0, 0.75);
  font-size: 16px;
  font-weight: 300;
  margin: 8px 0;
`;

export default function ExampleApp() {
  const [ctx, transition] = useMachine(/*, {}*/); // - alternative? supply initialCtx - for testing?
  const {init, submitting, submitted, error} = states;

  return (
    <Container>
      <State is={init}>
        <Header>Welcome!</Header>
        <Body>Join our mailing list by entering your email</Body>
        <ContactForm onSubmit={data => transition(submitting, data)}/>
      </State>

      <State is={submitting}>
        <Header>Sending</Header>
        <Loading text={`Sending to ${ctx.email}`} />
      </State>

      <State is={submitted}>
        <Header>Thank you, {ctx.name}!</Header>
      </State>

      <State is={error}>
        <Header style={{color: 'red'}}>Hmm... there appears to be an error</Header>
      </State>
    </Container>
  );
}
