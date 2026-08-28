import {NavLink,useLocation} from 'react-router-dom';import '../styles/company-foundry.css';
const items=[
 {label:'Overview',path:'/foundry',end:true},
 {label:'Academy',path:'/foundry/academy'},
 {label:'Cohorts',path:'/foundry/academy/cohorts'},
 {label:'Operator',path:'/foundry/academy/operator'},
 {label:'Production Lab',path:'/foundry#production'},
 {label:'Capstones',path:'/foundry#capstones'},
 {label:'Projects',path:'/foundry#projects'},
 {label:'Economics',path:'/foundry#economics'},
 {label:'Certification',path:'/foundry/academy/certification'},
 {label:'Stabilization',path:'/foundry/academy/stabilization'},
] as const;
export function FoundryNav(){const location=useLocation();if(!location.pathname.startsWith('/foundry'))return null;return <nav className="foundry-nav" aria-label="Company Foundry navigation"><div className="foundry-nav__brand"><strong>Company Foundry</strong><span>Build · Learn · Launch · Own</span></div><div className="foundry-nav__links">{items.map(item=><NavLink key={`${item.label}-${item.path}`} to={item.path} end={'end'in item?item.end:false} className={({isActive})=>{const hashActive=item.path.includes('#')&&location.pathname==='/foundry'&&location.hash===item.path.slice(item.path.indexOf('#'));return isActive||hashActive?'foundry-nav__link foundry-nav__link--active':'foundry-nav__link';}}>{item.label}</NavLink>)}</div></nav>}
