import React, { memo, useState } from 'react';
import { useSpring, a } from 'react-spring';
import { useMeasure, usePrevious } from './helpers';
import { Frame, Title, Content, toggle } from './styles';
import * as Icons from './icons';
import { Icon } from "@blueprintjs/core";

export const Tree = memo(({ children, name, style, defaultOpen = false, hasIcon }) => {
  const [isOpen, setOpen] = useState(defaultOpen);
  const previous = usePrevious(isOpen);
  const [bind, { height: viewHeight }] = useMeasure();
  const { height, opacity, transform } = useSpring({
    from: { height: 0, opacity: 0, transform: 'translate3d(20px,0,0)' },
    to: {
      height: isOpen ? viewHeight : 0,
      opacity: isOpen ? 1 : 0,
      transform: `translate3d(${isOpen ? 0 : 20}px,0,0)`,
    },
  });
  const IconC = Icons[`${children ? (isOpen ? 'Minus' : 'Plus') : 'Close'}SquareO`];

  return (
    <div>
        <div className="flex items-center mb-2">
            <IconC
            style={{ ...toggle, opacity: children ? 1 : 0.3 }}
            onClick={() => setOpen(!isOpen)}
            />
            <Icon icon="map-marker" iconSize={15} className={hasIcon ? `mr-4` : `hidden`}/>
            <Title style={style}>{name}</Title>
        </div>
      <Content
        style={{
          opacity,
          height: isOpen && previous === isOpen ? 'auto' : height,
        }}
      >
        <a.div style={{ transform }} {...bind} children={children} />
      </Content>
    </div>
  );
});

export default Tree;