import './Faces.css'


const faceList = [0,1,2,3,4,5,6,7,8,1,2,3,5,3,2,1];
const listItems = faceList.map(face =><li><div className="circle">face{face}</div></li>);

export function Faces({ setGuestCount }) {
  // Update guest count dynamically
  setGuestCount(faceList.length);
  return (
    <ul className="horizontal-list">
      {listItems}
    </ul>
    // <div className="horizontal-list">
    //   <div className="circle">face1</div>
    //   <div className="circle">face2</div>
    //   <div className="circle">face3</div>
    //   <div className="circle">face4</div>
    //   <div className="circle">face5</div>
    //   <div className="circle">face5</div>
    //   <div className="circle">face5</div>
    //   <div className="circle">face5</div>
    //   <div className="circle">face5</div>
    //   <div className="circle">face5</div>
    // </div>
  )
}