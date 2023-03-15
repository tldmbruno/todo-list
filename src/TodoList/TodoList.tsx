import { useEffect, useRef, useState } from 'react';

import { RenderList, Item } from '../RenderList/RenderList';
import { loadData, saveData } from '../DataHandler/DataHandler';
import { InputItem } from '../InputItem/InputItem';
import { useLocation } from 'react-router-dom';

import ButtonRandomizer from '../ButtonRandomizer/ButtonRandomizer';

import './TodoList.css';
import Divider from '../Divider/Divider';

export default function App() {
  // LocalStorage identification
  const listFile = useLocation();
  const fileId: number = listFile.state.fetchId;
  const fileData: string = 'todoListData' + fileId;
  
  // Declares and loads state data
  const itemRef = useRef<HTMLInputElement>(null);
  const [ list, setList ] = useState<Item[]>(() => {
    const data = loadData<Item[]>(fileData);
		return data ? data : [];
  });

  // Auto save on every change
	useEffect(() => {
		saveData(list, fileData);
	},[list])

  // Creates a new list item with a particular description
  function addItem(description: string) {
    // Encapsulates the item object
    const item = {
      id: Date.now(),
      text: description.trim().length === 0 ? 'Empty note' : description,
      highlighted: false
    };
    
    // Adds the item to the end of the list
    setList([...list, item]);
    saveData(list, fileData);
  }
  
  // Edits an item's content
  function editListItem(item: Item) {
    const itemIndex = list.findIndex((i) => i.id === item.id);
  
    let newList = [...list];
  
    newList[itemIndex].text = prompt('Enter the new text for the selected item', newList[itemIndex].text) ?? newList[itemIndex].text;
    setList(newList);
    saveData(list, fileData);
  }
  
  // Deletes a particular list item
  function deleteListItem(item: Item) {
    const itemIndex = list.findIndex((i) => i.id === item.id);
  
    if (itemIndex !== -1) {
      const newList = [...list];
      newList.splice(itemIndex, 1);
  
      setList(newList);
      saveData(list, fileData);
    }
  }

  function onRandomize(index: number) {
    const newList = [...list];

    newList.map(item => item.highlighted = false);
    newList[index].highlighted = true;

    setList(newList);
  }

  function toggleHighlighted(item: Item) {
    const itemIndex = list.findIndex((i) => i.id === item.id);

    const newList = [...list];
    newList[itemIndex].highlighted = !newList[itemIndex].highlighted;
    setList(newList);
  }

  return (
    <>
      <div className='flex'>
        <InputItem
          itemRef={itemRef}
          submitFunction={() => addItem(itemRef.current?.value ?? '')}/>

        <div className='flex gap'>
          <ButtonRandomizer 
            onRandomize={onRandomize}
            totalItems={list.length}/>
        </div>
      </div>

      <Divider />

      <RenderList
        toggleHighlighted={toggleHighlighted}
        editListItem={editListItem}
        deleteListItem={deleteListItem}
        itemList={list}/>
    </>
  );
}