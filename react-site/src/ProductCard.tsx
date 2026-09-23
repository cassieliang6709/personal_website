import type {Project} from './projects';
import mindbridge from './assets/mindbridge.svg';
import tabspace from './assets/tabspace-icon.png';
import capture from './assets/capture-icon.png';
import './product-card.css';

const icons: Record<string,string> = {mindbridge,tabspace,capture};
const monograms: Record<string,string> = {'1day':'1D',vance:'V',corpcheck:'Cc'};

export function ProductCard({project,onOpen}:{project:Project;onOpen:(project:Project)=>void}) {
 return <button className="product-card" aria-haspopup="dialog" onClick={()=>onOpen(project)}>
   <span className="product-card-top">
    <span className="product-icon" style={{background:project.accent}} aria-hidden="true">
     {icons[project.id]?<img src={icons[project.id]} alt=""/>:monograms[project.id]}
    </span>
    <span className="product-card-arrow" aria-hidden="true">↗</span>
   </span>
   <strong>{project.name}</strong>
   <span className="product-card-description">{project.description}</span>
   <span className="product-card-bottom"><span>{project.status}</span><span className="product-card-detail">详情 →</span></span>
 </button>;
}
