import { Link } from "react-router-dom";

export default function Menu() {
  return (
    <div>
      <ul className="menu bg-base-200 rounded-box w-56">
        <li>
          <Link to="/">Main</Link>
        </li>
        <li>
          <Link to="/new">New</Link>
        </li>
      </ul>
    </div>
  );
}
