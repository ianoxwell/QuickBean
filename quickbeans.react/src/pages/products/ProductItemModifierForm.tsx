import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import { IProductModifier } from '@models/modifier.dto';
import ModifierItem from './ModifierItem';
interface ReorderParams {
  list: IProductModifier[];
  startIndex: number;
  endIndex: number;
}

const ProductItemModifierForm = ({ productModifiers }: { productModifiers: IProductModifier[] }) => {
  // a little function to help us with reordering the result

  const reorder = ({ list, startIndex, endIndex }: ReorderParams): IProductModifier[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (result: DropResult<string>) => {
    // Handle the drag end event
    console.log('Drag ended:', result);
    productModifiers = reorder({
      list: productModifiers,
      startIndex: result.source.index,
      endIndex: result.destination ? result.destination.index : result.source.index
    });
  };

  const onRemoveModifier = (modifierId: number) => {
    // Handle the removal of a modifier
    console.log('Remove modifier with ID:', modifierId);
    // Implement the logic to remove the modifier from the productModifiers array
    productModifiers = productModifiers.filter((modifier) => modifier.id !== modifierId);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {/* Render your draggable items here */}
            {productModifiers.map((modifier, index) => (
              <Draggable key={modifier.id} draggableId={String(modifier.id)} index={index}>
                {(draggableProvided) => (
                  <div
                    ref={draggableProvided.innerRef}
                    {...draggableProvided.draggableProps}
                    {...draggableProvided.dragHandleProps}
                  >
                    <ModifierItem
                      modifier={modifier}
                      isEditVisible={false}
                      removeModifier={() => onRemoveModifier(modifier.id)}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ProductItemModifierForm;
