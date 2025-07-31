import styled from "styled-components";
import { Database } from "lucide-react";

// theme별 색상 팔레트 및 라벨
export const themeColors: Record<
  string,
  { bg: string; border: string; color: string }
> = {
  "Criticizing others as incompetent (무능) to justify hate": {
    bg: "rgba(59, 130, 246, 0.15)",
    border: "#3b82f6",
    color: "#3b82f6",
  },
  "Dehumanization through violence": {
    bg: "rgba(239, 68, 68, 0.15)",
    border: "#ef4444",
    color: "#ef4444",
  },
  "Emotional justification": {
    bg: "rgba(251, 191, 36, 0.15)",
    border: "#fbbf24",
    color: "#fbbf24",
  },
  "Moral high ground via hypocrisy (위선)": {
    bg: "rgba(16, 185, 129, 0.15)",
    border: "#10b981",
    color: "#10b981",
  },
};

export const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #0f172a;
  color: #f1f5f9;
`;

export const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

export const Title = styled.h1`
  width: 100%;
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  background: linear-gradient(to right, #60a5fa, #a78bfa);
  flex-shrink: 0;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 4px 0;
`;

export const RQ = styled.h3`
  width: 100%;
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
  background: white;
  flex-shrink: 0;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 8px 0;
`;

export const Grid = styled.div`
  flex-grow: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const Panel = styled.div`
  width: 100%;
  height: 100%;
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  background-color: #0f172a;
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid #334155;
`;

export const PanelTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #e2e8f0;
`;

export const DataItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1 1 0;
  min-height: 0;
  overflow-y: auto;
`;

export const DataItemCard = styled.div<{
  isSelected: boolean;
  themeKey: string;
}>`
  padding: 1rem;
  border-radius: 0.5rem;
  border: 2px solid;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${({ themeKey, isSelected }) =>
    isSelected
      ? themeColors[themeKey]?.bg || "#1e293b"
      : themeColors[themeKey]?.bg || "#1e293b"};
  border-color: ${({ themeKey, isSelected }) =>
    isSelected
      ? themeColors[themeKey]?.border || "#3b82f6"
      : themeColors[themeKey]?.border || "#334155"};
  box-shadow: ${({ isSelected, themeKey }) =>
    isSelected
      ? `0 0 20px ${themeColors[themeKey]?.border || "#3b82f6"}33`
      : "none"};
  &:hover {
    background-color: #1e293b;
  }
`;

export const ItemHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
`;

export const ItemType = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #cbd5e1;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const ItemTitle = styled.h3`
  font-weight: 600;
  color: #f1f5f9;
  margin-bottom: 0.25rem;
`;

export const ItemDescription = styled.p`
  font-size: 0.875rem;
  color: #94a3b8;
`;

export const SelectedItemInfo = styled.div`
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #1e293b;
  border-radius: 0.5rem;
  border: 1px solid #475569;
`;

export const ContentBox = styled.div`
  background-color: #0f172a;
  padding: 0.75rem;
  border-radius: 0.25rem;
  border: 1px solid #475569;
  margin-top: 0.75rem;
`;

export const CodeText = styled.code`
  font-size: 0.875rem;
  color: #cbd5e1;
  font-family: "Courier New", monospace;
`;

export const InteractionSection = styled.div`
  margin-bottom: 1.5rem;
`;

export const InteractionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #e2e8f0;
`;

export const InteractionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const InteractionButton = styled.button<{
  isSelected: boolean;
  disabled?: boolean;
}>`
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid;
  transition: all 0.2s;
  background-color: ${(props) =>
    props.isSelected ? "rgba(59, 130, 246, 0.2)" : "#1e293b"};
  border-color: ${(props) => (props.isSelected ? "#3b82f6" : "#475569")};
  box-shadow: ${(props) =>
    props.isSelected ? "0 0 20px rgba(59, 130, 246, 0.2)" : "none"};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  &:hover:not(:disabled) {
    transform: scale(1.02);
    background-color: ${(props) =>
      props.isSelected ? "rgba(59, 130, 246, 0.2)" : "#334155"};
    border-color: ${(props) => (props.isSelected ? "#3b82f6" : "#64748b")};
  }
`;

export const ButtonContent = styled.div`
  text-align: center;
`;

export const ButtonEmoji = styled.div`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

export const ButtonLabel = styled.div`
  font-weight: 600;
  font-size: 0.875rem;
  color: #e2e8f0;
  margin-bottom: 0.25rem;
`;

export const ButtonDescription = styled.div`
  font-size: 0.75rem;
  color: #94a3b8;
`;

export const LoadingState = styled.div`
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #1e293b;
  border-radius: 0.5rem;
  border: 1px solid #475569;
`;

export const LoadingContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const Spinner = styled.div`
  width: 1.5rem;
  height: 1.5rem;
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

export const LoadingText = styled.p`
  color: #cbd5e1;
`;

export const ErrorState = styled.div`
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: rgba(239, 68, 68, 0.2);
  border: 1px solid #dc2626;
  border-radius: 0.5rem;
`;

export const ErrorContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const ErrorText = styled.p`
  color: #f87171;
`;

export const ResultSection = styled.div`
  background-color: #1e293b;
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid #475569;
`;

export const ResultTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #e2e8f0;
`;

export const ResultContent = styled.div`
  background-color: #0f172a;
  padding: 1rem;
  border-radius: 0.25rem;
  border: 1px solid #475569;
`;

export const ResultText = styled.pre`
  font-size: 0.875rem;
  color: #cbd5e1;
  white-space: pre-wrap;
  font-family: "Courier New", monospace;
`;

export const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #94a3b8;
`;

export const EmptyContent = styled.div`
  text-align: center;
`;

export const EmptyIcon = styled(Database)`
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1rem;
  opacity: 0.5;
`;

export const EmptyText = styled.p`
  font-size: 1.125rem;
`;

export const FullScreenContainer = styled.div`
  min-height: 100vh;
  background-color: #0f172a;
  color: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const FullScreenContent = styled.div`
  text-align: center;
`;

export const FullScreenSpinner = styled.div`
  width: 3rem;
  height: 3rem;
  border: 2px solid transparent;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const FullScreenText = styled.p`
  font-size: 1.125rem;
`;

export const RetryButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2563eb;
  }
`;
