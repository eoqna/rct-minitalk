import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  height: 98%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #007bff;
  padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left); // iOS 노치 대응
`

export const InnerContainer = styled.div`
  width: calc(100% - 6px);
  height: calc(100% - 6px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #79d6e2;
  border-radius: 4px;
`

export const ContentContainer = styled.div`
  width: calc(100% - 6px);
  height: calc(100% - 6px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #e6f5f3;
  border-radius: 4px;
`