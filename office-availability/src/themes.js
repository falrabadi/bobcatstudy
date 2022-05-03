import { createGlobalStyle } from "styled-components";

export const lightTheme = {
  body: "#fff",
  text: "#000",
};

export const darkTheme = {
  body: "#36454F",
  text: "#fff",
};

export const GlobalStyles = createGlobalStyle`
    body{
        background-color: ${(props) => props.theme.body};
        color: ${(props) => props.theme.text};
    }
    
`;
