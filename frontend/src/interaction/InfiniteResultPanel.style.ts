import styled from "styled-components";

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

export const ItemList = styled.div`
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  padding: 8px;
  gap: 4px;
`;

export const ItemContainer = styled.div`
  width: 100%;
  border-radius: 4px;
  border: 1px solid #334155;
  background-color: #0f172a;
  cursor: pointer;
  display: flex;
  flex-direction: column;

  .head {
    width: 100%;
    display: flex;
    flex-direction: row;
    font-size: 13px;
    font-weight: 500;
    color: #e2e8f0;
    padding: 8px;
  }

  .reason {
    background-color: #334155;
    padding: 8px;
    font-size: 12px;
    color: #cbd5e1;
    border-radius: 0 0 4px 4px;
  }
`;
