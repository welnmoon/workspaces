import React from 'react';

type Props = {
  size?: number;
  stroke?: number;
  className?: string;
};

export function WorkspaceLogo({
  size = 50,
  stroke = 3,
  className = 'text-black',
}: Props) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      
      <span
        className="font-extrabold leading-none select-none"
        style={{ fontSize: size * 0.32 }}
        aria-label="W "
      >
        W&nbsp;
      </span>

      
      <div className="relative" style={{ width: size, height: size }}>
        
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0"
          fill="none"
          stroke="currentColor"
          style={{
            strokeWidth: (stroke / size) * 100,
            vectorEffect: 'non-scaling-stroke',
          }}
        >
          
          <path d="M5 5 H95 V95 M70 95 H5 V5" strokeLinecap="square" />
        </svg>

        
        <div
          className="absolute inset-0 grid grid-cols-3 grid-rows-2 place-items-center"
          style={{ padding: size * 0.12 }}
        >
          <span
            className="font-extrabold leading-none select-none"
            style={{ fontSize: size * 0.26 }}
          >
            S
          </span>
          <span
            className="font-extrabold leading-none select-none"
            style={{ fontSize: size * 0.26 }}
          >
            P
          </span>
          <span
            className="font-extrabold leading-none select-none"
            style={{ fontSize: size * 0.26 }}
          >
            A
          </span>
          <span
            className="font-extrabold leading-none select-none"
            style={{ fontSize: size * 0.26 }}
          >
            C
          </span>
          <span
            className="font-extrabold leading-none select-none"
            style={{ fontSize: size * 0.26 }}
          >
            E
          </span>
          <span /> 
        </div>
      </div>
    </div>
  );
}
