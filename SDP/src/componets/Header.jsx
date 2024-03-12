import Logo from "./Complexity Logo.png";
import "./Header.scss";
const header = () => {
  return (
    <div className="Header">
      <img src={Logo} />
      <h1>Complexify</h1>
    </div>
  );
};
export default header;
