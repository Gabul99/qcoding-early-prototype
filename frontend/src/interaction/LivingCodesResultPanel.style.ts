import styled from "styled-components";

export const Container = styled.div`
  background-color: #1e293b;
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid #475569;
  height: 100%;
  overflow-y: auto;
`;

export const SelectedGroupBar = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 16px;

  .label {
    font-size: 14px;
    font-weight: 600;
    color: #e2e8f0;

    &.right {
      text-align: right;
    }
  }
`;

/* Empty-state fallback */
export const EmptyState = styled.p`
  color: #94a3b8; /* slate-400 */
  font-size: 0.875rem;
  text-align: center;
`;

export const Nav = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;

  button {
    background: none;
    border: 1px solid #475569;
    border-radius: 0.25rem;
    color: #e2e8f0;
    width: 2rem;
    height: 2rem;
    cursor: pointer;
    &:disabled {
      opacity: 0.4;
      cursor: default;
    }
  }
`;

export const DialogueList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

export const Bubble = styled.div<{ side: "left" | "right" }>`
  max-width: 80%;
  background-color: ${({ side }) => (side === "left" ? "#334155" : "#475569")};
  align-self: ${({ side }) => (side === "left" ? "flex-start" : "flex-end")};
  padding: 0.5rem;
  border-radius: 0.5rem;
  position: relative;
  strong {
    display: block;
    font-size: 0.75rem;
    margin-bottom: 0.25rem;
  }
  p {
    margin: 0;
    line-height: 1.2;
  }
`;

export const Raw = styled.span`
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  cursor: help;
  font-size: 0.75rem;
`;

export const Decision = styled.div`
  background-color: #334155;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 8px;

  .title {
    font-weight: 600;
    font-size: 14px;
    color: #e2e8f0;
  }

  .decision {
    font-weight: 400;
    font-size: 13px;
    color: #e2e8f0;
  }
`;

export const Groups = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;

  h4 {
    margin: 0 0 0.5rem;
    color: #cbd5e1; /* slate-300 */
    font-size: 0.875rem;
  }
`;

export const ChipList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const Chip = styled.div<{ highlighted: boolean }>`
  background-color: #334155; /* slate-700 */
  color: #e2e8f0; /* slate-200 */
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  position: relative;

  ${({ highlighted }) =>
    highlighted
      ? `
    box-shadow: 0 0 0.5rem 0.1rem rgba(252, 211, 77, 0.8); /* amber-300 glow */
  `
      : ""}
`;
