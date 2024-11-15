import styled from "styled-components";

export const Button=styled.button`
  margin: 10px;
  padding: 15px 30px;
  text-align: center;
  transition: 0.5s;
  background-size: 200% auto;
  color: white;
  border-radius: 10px;
  display: center;
  border: 0px;
  font-weight: 700;
  box-shadow: 0px 0px 14px -7px #f09819;
  background-image: linear-gradient(80deg, #282891 0%, #6793d7  70%, #282891  100%);
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;




&:hover {
  background-position: right center;
  color: #fff;
  text-decoration: none;


}

&:active {
  transform: scale(0.95);
}
`


