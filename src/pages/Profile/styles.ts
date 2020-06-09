import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  > header {
    height: 100px;
    background: #28262e;
    display: flex;
    align-items: center;

    div {
      width: 100%;
      max-width: 1120px;
      margin: 0 auto;

      svg {
        color: #999591;
        width: 24px;
        height: 24px;
      }
    }
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: -78px auto 0;

  width: 100%;
  form {
    margin: 80px 0;
    width: 340px;
    text-align: center;
    display: flex;
    flex-direction: column;
    margin: 0 auto;

    h1 {
      margin-bottom: 24px;
      font-size: 20px;
      text-align: left;
    }

    input[name='old_password'] {
      margin-top: 24px;
    }

    a {
      color: #f4ede8;
      display: block;
      margin-top: 24px;
      text-decoration: none;
      transition: color 0.2s;

      &:hover {
        color: ${shade(0.2, '#f4ede8')};
      }
    }
  }
`;

export const AvatarInput = styled.div`
  margin-bottom: 32px;
  position: relative;
  width: 150px;
  align-self: center;

  label {
    width: 48px;
    height: 48px;
    position: absolute;
    background: #ff9000;
    border-radius: 50%;
    right: 0;
    bottom: 0;
    border: none;
    transition: background-color 0.2s;

    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    input {
      display: none;
    }

    svg {
      width: 20px;
      height: 20px;
      color: #312e38;
    }

    &:hover {
      background: ${shade(0.2, '#ff9000')};
    }
  }

  img {
    width: 150px;
    height: 150px;

    border-radius: 50%;
  }
`;
