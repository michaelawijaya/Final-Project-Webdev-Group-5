import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Pic = ({
  img = "",
  alt = "Item Photo",
  tapeText = "LOST ITEM // DO NOT REMOVE // REPORT EVIDENCE //"
}) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [img]);

  const showImage = img && !imgError;

  return (
    <StyledWrapper>
      <div className="manifesto-showcase">
        <div className="presentation-stage">
          <div className="poster-card">
            {/* Container Foto */}
            <div className="photo-container">
              {showImage ? (
                <img
                  src={img}
                  alt={alt}
                  className="photo-img"
                  onError={() => setImgError(true)}
                />
              ) : (
                <svg
                  className="photo-placeholder"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 5H4V19L13.2923 9.70649C13.6828 9.31595 14.3159 9.31591 14.7065 9.70641L20 15.0104V5ZM2 3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5551 2 20.0066V3.9934ZM8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11Z" />
                </svg>
              )}
            </div>

            {/* Tulisan Berjalan */}
            <div className="tape-ribbon">
              <div className="tape-scroll">
                <span>// {tapeText} // {tapeText} // {tapeText} // {tapeText} // {tapeText} // {tapeText} </span>
                <span>// {tapeText} // {tapeText} // {tapeText} // {tapeText} // {tapeText} // {tapeText} // </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .manifesto-showcase {
    --bg-outer: transparent;
    --bg-inner: #fdfdfa;
    --text-main: #0a0a0a;
    --accent: #ff2a00;
    --font-mono: "Courier New", Courier, monospace;

    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    
  }

  .manifesto-showcase * {
    box-sizing: border-box;
    border-radius : 10px;
  }

  .manifesto-showcase .presentation-stage {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: var(--bg-outer);
    padding: 10px;
    perspective: 1000px;
  }

  .manifesto-showcase .poster-card {
    position: relative;
    width: 350px;
    height: 400px;
    background-color: var(--bg-inner);
    border: 2px solid var(--text-main);
    overflow: hidden;
    transition: all 0.6s cubic-bezier(0.83, 0, 0.17, 1);
    transform-style: preserve-3d;
  }

  .manifesto-showcase .photo-container {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #6b6b6b;
    z-index: 1;
  }

  .manifesto-showcase .photo-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .manifesto-showcase .photo-placeholder {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 3.5rem;
    fill: #ffffff;
  }

  .manifesto-showcase .tape-ribbon {
    position: absolute;
    top: 75%;
    left: -30%;
    width: 160%;
    background: var(--accent);
    color: var(--bg-inner);
    transform: rotate(-12deg) scale(1.05);
    padding: 0.6rem 0;
    font-family: var(--font-mono);
    font-size: 0.8rem;
    font-weight: 900;
    white-space: nowrap;
    z-index: 20;
    display: flex;
    overflow: hidden;
    pointer-events: none;
  }

  .manifesto-showcase .tape-scroll {
    display: flex;
    width: max-content;
    animation: manifestoScrollText 10s linear infinite;
  }

  .manifesto-showcase .tape-scroll span {
    padding-right: 1rem;
  }

  @keyframes manifestoScrollText {
    to {
      transform: translateX(-50%);
    }
  }
`;

export default Pic;