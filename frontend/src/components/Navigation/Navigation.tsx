import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">NOTDIR</a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/">Main</Link>
          </li>
          <li>
            <Link to="/new">New</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
