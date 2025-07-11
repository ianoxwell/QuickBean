import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import { IProductModifier } from '@models/modifier.dto';
import { reorder } from 'src/utils/reorder.util';
import ProductModifierItem from './ProductModifierItem';
import { useProductFormContext } from './productFormContext';

const ProductItemModifierForm = () => {
  const form = useProductFormContext();
  const productModifiers = form.getValues().modifiers || [];

  const onDragEnd = (result: DropResult<string>) => {
    // Handle the drag end event
    const newModifiers = reorder<IProductModifier>({
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
                  <div ref={draggableProvided.innerRef} {...draggableProvided.draggableProps}>
                    <ProductModifierItem
                      modifier={modifier}
                      isViewVisible={false}
                      removeModifier={() => onRemoveModifier(modifier.id)}
                      dragHandleProps={draggableProvided.dragHandleProps}
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
