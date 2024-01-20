import React, { useState } from 'react';
import { Button, Modal,  message } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import './BlockEditor.css';


// The BlockEditor component is a functional React component that uses the useState hook to manage state variables: showModal,
//  blockType, and blocks.
// showModal is a boolean indicating whether the modal for adding blocks is visible.
// blockType is a string representing the type of block to be added ('text' or 'picture').
// blocks is an array that holds the information about each added block.
const BlockEditor = () => {
  const [showModal, setShowModal] = useState(false);
  const [blockType, setBlockType] = useState('');
  const [blocks, setBlocks] = useState([]);


  // handleEditBlockText is a function that updates the content of a text block at a specified index in the blocks array.

  const handleEditBlockText = (index, newText) => {
    const newBlocks = [...blocks];
    newBlocks[index] = { ...newBlocks[index], content: newText };
    setBlocks(newBlocks);
  };

  const handleAddBlock = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveBlock = () => {
    if (blockType === 'text' || blockType === 'picture') {
      setBlocks([...blocks, { type: blockType }]);
      setShowModal(false);
    }
  };

//   handleAddBlock sets showModal to true to display the modal for adding blocks.

// handleSaveBlock adds a new block to the blocks array based on the selected blockType and closes the modal.

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageUrl = await getBase64(file);
      setBlocks([...blocks, { type: 'picture', content: imageUrl }]);
      setShowModal(false);
      message.success(`${file.name} file uploaded successfully`);
    }
  };
  // handleFileChange is triggered when a file is selected. It reads the selected image file, converts it to a base64-encoded URL,
  //  and adds a new picture block to the blocks array.
  // getBase64 is a utility function that converts a file to a base64-encoded string.


  const getBase64 = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
    });
  };


  return (
    <div className="block-editor-container">
      <Button className="add-btn" type='secondary' icon={<PlusOutlined />} onClick={handleAddBlock}>
        Add Block
      </Button>

      <Modal 
      
      visible={showModal}
      title="Add Block"
      onCancel={handleCloseModal}
      onOk={handleSaveBlock}
      maskClosable={false}
      okButtonProps={{ disabled: !blockType, style: { background: '#000', color: '#fff' } }}
      cancelButtonProps={{ style: { background: '#000', color: '#fff', borderColor: '#000' } }}
      >
        <div>
          <Button
            value="text"
            className="button" 
            style={{ width: '48%', margin:'5px' }}
            onClick={() => setBlockType('text')}
          >
            Text Block
          </Button>
          <Button
            value="picture"
            className="button" 
            style={{ width: '48%' }}
            onClick={() => setBlockType('picture')}
          >
            Picture Block
          </Button>
        </div>

        {blockType === 'picture' && (
          <div>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
        )}
      </Modal>

      <div className="blocks-container">
        {blocks.map((block, index) => (
          <div key={index} className="block">
            {block.type === 'text' && (
              <>
                <p>This is a text block.</p>
                <textarea
                  value={block.content || ''}
                  onChange={(e) => handleEditBlockText(index, e.target.value)}
                  maxLength={230}
                  style={{ width: '100%', minHeight: '100px' }}
                />
              </>
            )}
            {block.type === 'picture' && (
              <div style={{ width: '100%', minHeight: '100px' }}>
                <img
                  src={block.content}
                  alt="Uploaded"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                
              </div>
            )}
            <EditOutlined className="edit-icon" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlockEditor;
