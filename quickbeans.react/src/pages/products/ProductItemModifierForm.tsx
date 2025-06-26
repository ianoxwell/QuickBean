import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import { IProductModifier } from '@models/modifier.dto';
import ProductModifierItem from './ProductModifierItem';
import { useProductFormContext } from './productFormContext';
interface ReorderParams {
  list: IProductModifier[];
  startIndex: number;
  endIndex: number;
}

const ProductItemModifierForm = () => {
  const form = useProductFormContext();
  const productModifiers = form.getValues().modifiers || [];

  const reorder = ({ list, startIndex, endIndex }: ReorderParams): IProductModifier[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result.map((modifier, index) => ({
      ...modifier,
      order: index // Update the order based on the new index
    }));
  };

  const onDragEnd = (result: DropResult<string>) => {
    // Handle the drag end event
    const newModifiers = reorder({
      list: productModifiers,
      startIndex: result.source.index,
      endIndex: result.destination ? result.destination.index : result.source.index
    });
    form.setFieldValue('modifiers', newModifiers);
  };

  const onRemoveModifier = (modifierId: number) => {
    // Handle the removal of a modifier
    const updatedModifiers = productModifiers
      .filter((modifier) => modifier.id !== modifierId)
      .map((modifier, index) => ({
        ...modifier,
        order: index // Update the order based on the new index
      }));
    form.setFieldValue('modifiers', updatedModifiers);
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
                    <ProductModifierItem
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
