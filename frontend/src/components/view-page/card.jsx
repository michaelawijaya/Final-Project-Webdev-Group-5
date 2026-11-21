import React from 'react';
import styled from 'styled-components';

const Card = ({ name = "Default Title", buttonText = "Details", onClick }) => {
  return (
    <StyledWrapper>
      <div className="card">
        <div className="image_container">
          <svg className="image" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M20 5H4V19L13.2923 9.70649C13.6828 9.31595 14.3159 9.31591 14.7065 9.70641L20 15.0104V5ZM2 3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5551 2 20.0066V3.9934ZM8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11Z" />
          </svg>
        </div>
        <div className="title">
          <span>{name}</span>
        </div>
        <button className="cart-button" onClick={onClick}>
          <span>{buttonText}</span>
        </button>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    --bg-card: #ffffff;
    --primary: #632e00;
    --primary-800: #838383;
    --primary-shadow: #ffffff;
    --light: #ffab6b;
    --zinc-800: #18181b;
    --bg-linear: linear-gradient(0deg, var(--primary) 50%, var(--light) 125%);

    position: relative;

    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    padding: 1rem;
    width: 14rem;
    background-color: var(--bg-card);

    border-radius: 1rem;
  }

  .image_container {
    overflow: hidden;
    cursor: pointer;

    position: relative;
    z-index: 5;

    width: 100%;
    height: 15rem;
    background-color: var(--primary-800);

    border-radius: 0.5rem;
  }

  .image_container .image {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    width: 3rem;
    fill: var(--light);
  }

  .title {
    overflow: clip;

    width: 100%;

    font-size: 1rem;
    font-weight: 600;
    color: var(--light);
    text-transform: capitalize;
    text-wrap: nowrap;
    text-overflow: ellipsis;
  }

  .cart-button {
    cursor: pointer;

    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.25rem;

    padding: 0.5rem;
    width: 100%;
    background-image: var(--bg-linear);

    font-size: 0.75rem;
    font-weight: 500;
    color: var(--light);
    text-wrap: nowrap;

    border: 2px solid hsla(34, 97%, 11%, 0.50);
    border-radius: 0.5rem;
    box-shadow: inset 0 0 0.25rem 1px var(--light);
  }`;

export default Card;
