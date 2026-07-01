import { useParams } from "react-router-dom";

export default function MediaDetailsPage() {
  const { type, id } = useParams();
  
  return (
    <div className="page-container">
      <h1>Media Details</h1>
      <p className="text-muted">Type: {type}, ID: {id}</p>
    </div>
  );
}
