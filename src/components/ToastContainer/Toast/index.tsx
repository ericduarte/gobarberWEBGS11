import React, { useEffect } from 'react';
import {
  FiAlertCircle,
  FiXCircle,
  FiInfo,
  FiCheckCircle,
} from 'react-icons/fi';
import { Container } from './styles';
import { ToastMessage, useToast } from '../../../hooks/toast';

interface ToastProps {
  toast: ToastMessage;
  style: object;
}

const icons = {
  info: <FiInfo size={24} />,
  error: <FiAlertCircle size={24} />,
  success: <FiCheckCircle size={24} />,
};

const Toast: React.FC<ToastProps> = ({ toast, style }) => {
  const { removeToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, 3000);

    // isso é executado ao componente deixar de existir
    // no caso é necessário evitar a executação do timer após
    // a destruição do componente
    return () => {
      clearTimeout(timer);
    };
  }, [toast.id, removeToast]);

  return (
    <Container
      key={toast.id}
      type={toast.type}
      hasDescription={!!toast.description}
      style={style}
    >
      {icons[toast.type || 'info']}
      <div>
        <strong>{toast.title}</strong>
        {toast.description && <p>{toast.description}</p>}
      </div>
      <button type="button" onClick={() => removeToast(toast.id)}>
        <FiXCircle size={18} />
      </button>
    </Container>
  );
};

export default Toast;
