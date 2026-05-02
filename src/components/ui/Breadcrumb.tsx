import { Link } from 'react-router-dom';
import s from './Breadcrumb.module.css';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  if (items.length < 2) return null;

  return (
    <nav className={s.breadcrumb} aria-label="Fil d'Ariane">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={item.url} style={{ display: 'contents' }}>
            {i > 0 && <span className={isLast ? s.lastSep : s.sep}>/</span>}
            {isLast ? (
              <span className={s.current}>{item.name}</span>
            ) : (
              <Link to={item.url} className={s.link}>
                {item.name}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
