import * as React from 'react';
import styles from '../App.module.css';

type InputWithLabelProps = {
  id: string,
  value: string,
  type?: string,
  isFocused?: boolean,
  onInputChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  children: React.ReactNode;
}

const InputWithLabel: React.FC<InputWithLabelProps> = ({ 
  id, 
  value, 
  type = 'text', 
  onInputChange, 
  isFocused, 
  children 
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id} className={styles.label}>{children}</label>
        &nbsp;
        <input 
        ref={inputRef}
        id={id} 
        type={type}
        value={value} 
        onChange={onInputChange} 
        className={styles.input}
      /> 
    </>
  );
};

export default InputWithLabel;