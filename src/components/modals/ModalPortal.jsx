// src/components/modals/ModalPortal.jsx
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Компонент-портал для рендеринга дочерних элементов в DOM-узел,
 * отличный от родительского. Используется для модальных окон,
 * чтобы избежать проблем с наложением и позиционированием.
 * @param {object} props - Свойства компонента.
 * @param {React.ReactNode} props.children - Дочерние элементы для рендеринга.
 * @returns {React.ReactPortal|null}
 */
const ModalPortal = ({ children }) => {
  const [modalRoot, setModalRoot] = useState(null);

  useEffect(() => {
    let currentElement = document.getElementById('modal-root');
    
    // Если элемент не найден, создаем его динамически
    if (!currentElement) {
      currentElement = document.createElement('div');
      currentElement.setAttribute('id', 'modal-root');
      document.body.appendChild(currentElement);
    }
    
    setModalRoot(currentElement);
    
    // Функция очистки для удаления элемента при размонтировании
    return () => {
      // Проверяем, был ли элемент создан динамически
      if (currentElement && document.body.contains(currentElement) && !document.getElementById('modal-root')) {
        document.body.removeChild(currentElement);
      }
    };
  }, []);

  if (!modalRoot) {
    return null;
  }

  return createPortal(
    children,
    modalRoot
  );
};

export default ModalPortal;