import styled, { css, keyframes } from "styled-components";

export const Container = styled.div`
  background-color: #1e293b;
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid #475569;
  height: 100%;
  overflow-y: auto;
`;

export const TopBar = styled.div`
  width: 100%;
  padding: 8px;
  border-bottom: 1px solid #475569;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #e2e8f0;

  .control-panel {
    display: flex;
    flex-direction: row;
    gap: 4px;
    align-items: center;
    margin-left: auto;

    .control {
      cursor: pointer;

      &.selected {
        font-weight: 600;
      }
    }
  }
`;

export const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const ItemsZone = styled.div`
  position: relative;
  background: #1f1f2e;
  width: 100%;
  height: 320px;
`;

const spin = keyframes`
  from { stroke-dashoffset: 100; }
  to { stroke-dashoffset: 0; }
`;

export const Idea = styled.div<{ remaining: number }>`
  position: absolute;
  padding: 6px 10px;
  max-width: 150px;
  background: #2a2a3b;
  color: #eee;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  pointer-events: all;
  ${({ remaining }) => css`
    border: 1px solid #4f5d78;
    &:after {
      content: "";
      position: absolute;
      top: -2px;
      left: -2px;
      width: calc(100% + 4px);
      height: calc(100% + 4px);
      border: 2px solid transparent;
      border-top-color: #8ab4f8;
      border-radius: 6px;
      animation: ${spin} ${remaining}ms linear forwards;
    }
  `}
`;

export const PinnedArea = styled.div`
  margin-top: 16px;
  background: rgba(30, 30, 40, 0.9);
  padding: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const PinnedItem = styled.div`
  background: #3a3a4f;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 12px;
  color: #fff;
  flex: 1 1 calc(33% - 16px);

  .header {
    width: 100%;
    display: flex;
    align-items: center;

    .icon {
      margin-left: auto;
      cursor: pointer;
    }
  }
`;
