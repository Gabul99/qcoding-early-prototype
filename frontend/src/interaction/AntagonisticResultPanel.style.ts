import styled from "styled-components";

export const Container = styled.div`
  background-color: #1e293b;
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid #475569;
  height: 100%;
  overflow-y: auto;
`;

/* Empty-state fallback */
export const EmptyState = styled.p`
  color: #94a3b8; /* slate-400 */
  font-size: 0.875rem;
  text-align: center;
`;

/* Vertical stack of bubbles */
export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

/* One speech-bubble */
export const Bubble = styled.div`
  background-color: #0f172a; /* slate-900 */
  border: 1px solid #334155; /* slate-700 */
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  transition: border 0.15s;

  &:hover {
    border-color: #6366f1; /* indigo-500 on hover */
  }
`;

/* Header line: mode + target */
export const Meta = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #94a3b8; /* slate-400 */
`;

/* Main response text */
export const Body = styled.p`
  margin-top: 0.35rem;
  font-size: 0.875rem;
  line-height: 1.3;
  color: #e2e8f0; /* slate-200 */
  white-space: pre-wrap; /* keep line-breaks */
  word-break: break-word;
`;
