"use client";

import React from "react";
import styled from "styled-components";

type CardProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export const GlassCard = ({ title, children, className }: CardProps) => {
  return (
    <StyledWrapper className={className}>
      <div className="container">
        <div className="box">
          <span className="title">{title}</span>
          <div>{children}</div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .container {
    color: var(--brand-900);
    position: relative;
    font-family: sans-serif;
  }

  .container::before,
  .container::after {
    content: "";
    background-color: #fab5704c;
    position: absolute;
  }

  .container::before {
    border-radius: 50%;
    width: 6rem;
    height: 6rem;
    top: 30%;
    right: 7%;
  }

  .container .box {
    width: 100%;
    height: 100%;
    padding: 1.5rem;
    background-color: rgba(255, 255, 255, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.222);
    -webkit-backdrop-filter: blur(20px);
    backdrop-filter: blur(20px);
    border-radius: 0.7rem;
    transition: all ease 0.3s;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  .container .box .title {
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    color: var(--brand-700);
    margin-bottom: 1rem;
  }

  .container .box div strong {
    display: block;
    margin-bottom: 0.5rem;
  }

  .container .box div p {
    margin: 0;
    font-size: 0.9em;
    font-weight: 300;
    letter-spacing: 0.1em;
    color: var(--brand-800);
  }

  .container .box div span {
    font-size: 0.7rem;
    font-weight: 300;
  }

  .container .box div span:nth-child(3) {
    font-weight: 500;
    margin-right: 0.2rem;
  }

  .container .box:hover {
    box-shadow: 0px 0px 20px 1px #ffbb763f;
    border: 1px solid rgba(255, 255, 255, 0.454);
  }
`;


