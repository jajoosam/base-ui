import styled from "@emotion/styled";

export default styled.mark`
  display: inline-block;
  font-size: 0.85em;
  padding: 0.5em;
  margin: 0;
  user-select: none;
  background: ${(props) => props.color};
  color: white;
  font-family: monospace;
  font-weight: 700;
`;
