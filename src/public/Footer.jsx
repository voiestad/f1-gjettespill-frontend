import { EllipsisIcon, HomeIcon, NotebookPenIcon, User2Icon, Users2Icon } from "lucide-react";
import { Link, useLocation } from "react-router";

function Footer() {
  const { pathname } = useLocation();

  const navItems = [
    { to: "/", icon: <HomeIcon size={20} />, label: "Hjem" },
    { to: "/guess", icon: <NotebookPenIcon size={20} />, label: "Gjetting" },
    { to: "/user/myprofile", icon: <User2Icon size={20} />, label: "Profil" },
    { to: "/league", icon: <Users2Icon size={20} />, label: "Liga" },
    { to: "/more", icon: <EllipsisIcon size={20} />, label: "Mer" },
  ];

  return (
    <footer>
      <p><Link to="/about">Om siden</Link></p>
      <p><Link to="/github">GitHub</Link></p>
      <p><Link to="/contact">Kontakt</Link></p>
      <p><Link to="/privacy">Personvernerklæring</Link></p>

      {navItems.map(({ to, icon, label }) => (
        <div key={to} className={pathname === to ? "selected" : "not-selected"}>
          <Link to={to}>
            {icon}
            <div>{label}</div>
          </Link>
        </div>
      ))}
    </footer>
  );
}

export default Footer;
