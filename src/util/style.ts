import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  height: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #007bff;
  min-height: -webkit-fill-available; // iOS Safari 대응
  padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left); // iOS 노치 대응
`