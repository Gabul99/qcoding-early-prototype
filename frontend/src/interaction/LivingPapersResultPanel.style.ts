import styled from "styled-components";

export const Container = styled.div`
  background-color: #1e293b;
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid #475569;
  height: 100%;
  overflow-y: auto;
  width: 100%;
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
  transition: border 0.15s;
  display: flex;
  flex-direction: column;
  align-items: center;

  &:hover {
    border-color: #6366f1; /* indigo-500 on hover */
  }
`;

export const UpperPart = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  padding: 8px;
`;

export const Emoji = styled.div`
  width: fit-content;
  height: fit-content;
  font-size: 40px;
  flex-shrink: 0;
`;

export const MessagePart = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;

  .name {
    font-size: 14px;
    font-weight: 600;
    color: #e2e8f0;
  }

  .message {
    font-size: 14px;
    font-weight: 400;
    color: #e2e8f0;
  }
`;

export const TitlePart = styled.div`
  width: 100%;
  display: flex;
  background-color: #334155;
  padding: 8px;
  font-size: 12px;
  color: #94a3b8;
  border-radius: 0 0 0.5rem 0.5rem;
`;
