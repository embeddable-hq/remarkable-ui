import React, { useEffect, useRef, useState } from 'react';
import { useThemeFormatter } from '../../../theme/theme-formatter/theme-formatter.hook';

type Props = {
  onChange: (v: string) => void;
  title?: string;
  value?: string;
  placeholder: string;
};

let timeout: number | null = null;

const TextInput = (props: Props) => {
  const themeFormatter = useThemeFormatter();

  const ref = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState(props.value);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = window.setTimeout(() => {
      props.onChange(e.target.value);
    }, 1000);
  };

  return (
    <div title={props.title}>
      {themeFormatter.text('welcome')}
      <div
        className={`
          border
          h-10
          pr-8
          relative
          w-full
          bg-[color:--embeddable-controls-backgrounds-colors-soft]
          border-[color:--embeddable-controls-borders-colors-normal]
          rounded-[--embeddable-controls-borders-radius]
        `}
      >
        <input
          ref={ref}
          placeholder={props.placeholder}
          className={`
            border-0
            h-full
            leading-10
            outline-none
            px-3
            w-full
            bg-[color:--embeddable-controls-backgrounds-colors-transparent]
            rounded-[--embeddable-controls-borders-radius]
          `}
          onChange={handleChange}
          defaultValue={value}
        />
        {!!value && (
          <div
            onClick={() => {
              setValue('');
              props.onChange('');
              ref.current!.value = '';
              ref.current?.focus();
            }}
            className="opacity-50 hover:opacity-100 absolute w-10 right-0 top-0 h-full cursor-pointer group flex items-center justify-center"
          >
            hey
          </div>
        )}
      </div>
    </div>
  );
};

export default TextInput;
