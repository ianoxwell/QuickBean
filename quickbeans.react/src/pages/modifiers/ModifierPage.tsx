import { useParams } from 'react-router-dom';

const ModifierPage = () => {
  const { id: modifierId } = useParams<{ id: string }>();
  if (!modifierId) {
    return null; // Handle the case where modifierId is not provided
  }

  return (
    <div>
      <h1>Individual Modifier</h1>
      <p>Modifier ID: {modifierId}</p>
    </div>
  );
};

export default ModifierPage;
